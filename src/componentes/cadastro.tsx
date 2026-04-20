import { Button, Card, Form, Input, message } from 'antd';
import type { FormProps } from 'antd';
import type { FieldType } from "./cadastro.ts";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../services/firebase.ts";
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
function Cadastro() {
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {     
        const { email, password, nomeCompleto } = values;
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const id = userCredential.user.uid;
            const saveUser = doc(db, "usuarios", id);
            await setDoc(saveUser, { nomeCompleto, email });
            message.success("Cadastro realizado com sucesso!");
            navigate("/perfil");
        } catch (error) {
            console.log(error);
            message.error("Erro ao cadastrar!");
        }
    };
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Card title="Cadastro" style={{ maxWidth: 500, margin: 'auto' }}>
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
                    label="Nome Completo"
                    name="nomeCompleto"
                    rules={[
                        { required: true, message: 'Please input your name!' },
                    ]}
                >
                    <Input />
                </Form.Item>
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

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
export default Cadastro;
