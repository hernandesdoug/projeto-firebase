import { Button, Card, Form, Input, DatePicker, Layout, Radio, Select, Typography, Flex } from 'antd';
import type { FormProps } from 'antd';
import type { FieldType } from "./cadastro.ts";
import { ArrowLeftOutlined, UserAddOutlined, LoginOutlined } from '@ant-design/icons';
const { Content } = Layout;
const { Title, Paragraph } = Typography;
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../services/firebase.ts";
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate, Link } from "react-router-dom";
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import ptBR from 'antd/es/date-picker/locale/pt_BR';

function Cadastro() {
    const [especialidades, setEspecialidades] = useState<any[]>([]);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const perfil = Form.useWatch("perfil", form);
    const getEspecialidades = async () => {

        const querySnapshot = await getDocs(collection(db, "especialidades"));
        const lista = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        const options = lista.map((item: any) => ({ value: item.id, label: item.nomeEspecialidade }))
        setEspecialidades(options);
    }
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email,
            password,
            nomeCompleto,
            birthDate,
            perfil, convenio, especialidade, crm } = values;
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const id = userCredential.user.uid;
            const saveUser = doc(db, "usuarios", id);
            await setDoc(saveUser, {
                nomeCompleto, email, birthDate, perfil,
                ...(perfil === 'medico' && { especialidade, crm }),
                ...(perfil === 'paciente' && { convenio })
            });
            toast.success("Cadastro realizado com sucesso!");
            if (perfil === 'paciente') {
                navigate(`/paciente/${nomeCompleto}`);
            } else if (perfil === 'medico') {
                navigate(`/medico/${nomeCompleto}`);
            } else {
                toast.error("perfil invalido!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Erro ao cadastrar!");
        }
    };
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        if (perfil !== "medico") {
            form.setFieldsValue({ crm: undefined, especialidade: undefined });
        }
    }, [perfil]);
    useEffect(() => {
        getEspecialidades();
    }, []);
    return (
        <Layout style={{ minHeight: '100%', background: '#f5f7fb' }}>
            <Content
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px 24px'
                }}
            >
                <Card style={{ width: '100%', maxWidth: 600, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                    <Flex
                        vertical
                        align="center"
                        style={{ marginBottom: 32 }}
                    >
                        <UserAddOutlined
                            style={{
                                fontSize: 52,
                                color: '#1677ff',
                                marginBottom: 16
                            }}
                        />

                        <Title level={2} style={{ marginBottom: 8 }}>
                            Criar Conta
                        </Title>

                        <Paragraph
                            style={{
                                color: '#8c8c8c',
                                textAlign: 'center'
                            }}
                        >
                            Cadastre-se para acessar o sistema médico
                        </Paragraph>
                    </Flex>
                    <Form
                        form={form}
                        name="basic"
                        layout='vertical'
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Nome Completo"
                            name="nomeCompleto"
                            rules={[
                                { required: true, message: 'Digite seu nome completo!' },
                            ]}
                        >
                            <Input size='large' placeholder='Seu nome completo'/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Digite seu email!' },
                                { type: "email", message: 'Digite um email válido!' },
                            ]}
                        >
                            <Input size='large' placeholder='email@email.com'/>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Digite sua senha!' }]}
                        >
                            <Input.Password size='large' placeholder='Digite sua senha'/>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Data Nascimento"
                            name="birthDate"
                            getValueProps={(value) => ({ value: value ? dayjs(value) : undefined })}
                            getValueFromEvent={(e) => e?.format("DD/MM/YYYY")}
                            rules={[{ required: true, message: 'Informe sua data de nascimento!' }]}
                        >
                            <DatePicker size='large' locale={ptBR} format={"DD/MM/YYYY"} style={{ width: '100%'}} placeholder="Selecione a data"/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Perfil"
                            name="perfil"
                            rules={[{ required: true, message: "Selecione um perfil" }]}
                        >
                            <Radio.Group>
                                <Radio value="paciente"> Paciente </Radio>
                                <Radio value="medico"> Médico </Radio>
                            </Radio.Group>

                        </Form.Item>
                        {perfil === "paciente" && (
                            <Form.Item
                                label="Convênio"
                                name="convenio"
                                rules={[{ required: true, message: "Informe o convenio" }]}
                            >
                                <Input size='large' placeholder='Nome do convênio'/>
                            </Form.Item>
                        )}
                        {perfil === "medico" && (
                            <Form.Item
                                label="CRM"
                                name="crm"
                                rules={[{ required: true, message: "Informe o CRM" }]}
                            >
                                <Input  size='large' placeholder='Digite seu CRM'/>
                            </Form.Item>
                        )}
                        {perfil === "medico" && (
                            <Form.Item
                                label="Especialidade:"
                                name="especialidade"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Select size='large' placeholder="Selecione uma especialidade"
                                    options={especialidades}

                                />

                            </Form.Item>
                        )}
                        <Form.Item style={{ marginTop: 32 }}>
                            <Button type="primary" htmlType="submit" size='large' block>
                                Criar Conta
                            </Button>
                        </Form.Item>
                    </Form>
                    <Flex
                        justify="space-between"
                        wrap="wrap"
                        gap="small"
                        style={{ marginTop: 16 }}
                    >

                        <Button icon={<ArrowLeftOutlined />}>
                            <Link to="/">
                                Voltar para Home
                            </Link>
                        </Button>

                        <Button
                            type="link"
                            icon={<LoginOutlined />}
                        >
                            <Link to="/login">
                                Já tenho conta
                            </Link>
                        </Button>

                    </Flex>
                </Card>
            </Content>
        </Layout>
    )
}
export default Cadastro;
