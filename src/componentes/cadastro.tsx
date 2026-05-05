import { Button, Card, Form, Input, DatePicker, Layout, Radio } from 'antd';
import type { FormProps } from 'antd';
import type { FieldType } from "./cadastro.ts";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../services/firebase.ts";
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function Cadastro() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const perfil = Form.useWatch("perfil", form);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, 
             password, 
         nomeCompleto, 
            birthDate, 
            perfil, convenio, especialidade, crm} = values;
        console.log(values);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const id = userCredential.user.uid;
            const saveUser = doc(db, "usuarios", id);
            await setDoc(saveUser, { nomeCompleto, email, birthDate, perfil,
                ...(perfil === 'medico' && {especialidade, crm}),
                ...(perfil === 'paciente' && {convenio})
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
    return (
        <Layout style={{ minHeight: '100%' }}>
            <Card title="Cadastro" style={{ minWidth: 500, margin: 'auto' }}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Nome Completo"
                        name="nomeCompleto"
                        rules={[
                            { required: true, message: 'Entre com seu nome completo!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Entre com seu email!' },
                            { type: "email", message: 'Insira um email válido!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Entre com sua senha!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Data Nascimento"
                        name="birthDate"
                        getValueProps={(value) => ({ value: value ? dayjs(value) : undefined })}
                        getValueFromEvent={(e) => e?.format("DD/MM/YYYY")}
                        rules={[{ required: true, message: 'Insira sua data de nascimento!' }]}
                    >
                        <DatePicker format={"DD/MM/YYYY"} />
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
                            <Input/>
                        </Form.Item>
                    )}
                    {perfil === "medico" && (
                        <Form.Item
                            label="CRM"
                            name="crm"
                            rules={[{ required: true, message: "Informe o CRM" }]}
                        >
                            <Input/>
                        </Form.Item>
                    )}
                    {perfil === "medico" && (
                        <Form.Item
                            label="Especialidade"
                            name="especialidade"
                            rules={[{ required: true, message: "Informe a especialidade" }]}
                        >
                            <Input />
                        </Form.Item>
                    )}
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    )
}
export default Cadastro;
