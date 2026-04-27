import { Button, Card, Form, Input, DatePicker, Layout, Radio } from 'antd';
import type { FormProps } from 'antd';
import type { FieldType } from "./cadastro.ts";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../services/firebase.ts";
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

function Cadastro() {
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { email, password, nomeCompleto, birthDate, perfil } = values;
        console.log(values);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const id = userCredential.user.uid;
            const saveUser = doc(db, "usuarios", id);
            await setDoc(saveUser, { nomeCompleto, email, birthDate, perfil });
            const username = email.split('@')[0];
            toast.success("Cadastro realizado com sucesso!");
            if (perfil === 'paciente') {
                navigate(`/paciente/${username}`);
            } else {
                navigate(`/medico/${username}`);
            }
        } catch (error) {
            console.log(error);
            toast.error("Erro ao cadastrar!");
        }
    };
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout style={{ minHeight: '100%' }}>
            <Card title="Cadastro" style={{ minWidth: 500, margin: 'auto' }}>
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

                    <Form.Item<FieldType>
                        label="Data Nascimento"
                        name="birthDate"
                        getValueProps={(value) => ({ value: value ? dayjs(value) : undefined })}
                        getValueFromEvent={(e) => e?.format("DD/MM/YYYY")}
                        rules={[{ required: true, message: 'Please input your date!' }]}
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
