import type { FieldType } from "./login.ts";
import { Button, Checkbox, Form, Input, Card, Layout, Flex, Typography } from 'antd';
const { Content } = Layout;
const { Title, Paragraph } = Typography;
import { ArrowLeftOutlined, UserAddOutlined, LoginOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, } from "firebase/firestore";
import { db, auth } from "../services/firebase.ts";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, password } = values;
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const ref = doc(db, "usuarios", userCredential.user.uid);
            const snapshot = await getDoc(ref);

            if (!snapshot.exists()) {
                toast.error("perfil nao encontrado!");
                return;
            }

            const dados = snapshot.data() as FieldType;
            const perfil = dados.perfil;
            const name = dados.nomeCompleto;

            toast.success("Login realizado com sucesso!");
            if (perfil === "paciente") {
                navigate(`/paciente/${name}`);
            } else if (perfil === "medico") {
                navigate(`/medico/${name}`);
            } else if (perfil === 'admin') {
                navigate(`/admin/${name}`);
            } else {
                toast.error("perfil inválido");
            }
        } catch (error) {
            toast.error("Erro ao fazer login, verifique suas credenciais!");
            console.error(error);
        }
    };
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout style={{ minHeight: '100%', background: '#f5f7fb' }}>
            <Content style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24
            }}>
                <Card style={{
                    width: '100%',
                    maxWidth: 480,
                    borderRadius: 16,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}>
                    <Flex
                        vertical
                        align="center"
                        style={{ marginBottom: 32 }}
                    >
                        <LoginOutlined
                            style={{
                                fontSize: 52,
                                color: '#1677ff',
                                marginBottom: 16
                            }}
                        />

                        <Title level={2} style={{ marginBottom: 8 }}>
                            Bem-vindo
                        </Title>

                        <Paragraph
                            style={{
                                color: '#8c8c8c',
                                textAlign: 'center'
                            }}
                        >
                            Faça login para acessar o sistema médico
                        </Paragraph>
                    </Flex>

                    <Form
                        name="basic"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Digite seu email!' },
                                { type: "email", message: 'Digite um email válido!' },
                            ]}
                        >
                            <Input size="large" placeholder="seuemail@email.com" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Digite sua senha!' }]}
                        >
                            <Input.Password size="large" placeholder="Digite sua senha" />
                        </Form.Item>

                        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                            <Checkbox>Lembrar de mim</Checkbox>
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" size="large" block>
                                Submit
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
                            icon={<UserAddOutlined />}
                        >
                            <Link to="/cadastro">
                                Criar conta
                            </Link>
                        </Button>

                    </Flex>
                </Card>
            </Content>
        </Layout>
    )
}

export default Login;