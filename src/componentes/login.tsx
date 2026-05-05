import type { FieldType } from "./login.ts";
import { Button, Checkbox, Form, Input, Card, Layout } from 'antd';
import type { FormProps } from 'antd';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, } from "firebase/firestore";
import { db, auth } from "../services/firebase.ts";
import { useNavigate } from "react-router-dom";
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
        <Layout style={{ minHeight: '100%' }}>
            <Card title="Login" style={{ maxWidth: 500, margin: 'auto' }}>
                <Form
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
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: "email", message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

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

export default Login;