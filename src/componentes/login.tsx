import type { FieldType } from "./login.ts";
import { Button, Checkbox, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase.ts";

 const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const { email, password } = values;
      try {
        const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
     console.log('Usuário logado:', userCredential.user);
    } catch (error) {
       console.error(error); 
    }
    
};
const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
  
function Login() {
   
    return (
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
                rules={[{ required: true, message: 'Please input your email!' }]}
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
    )

}

export default Login;