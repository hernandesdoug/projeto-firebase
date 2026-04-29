import { Layout, Card, Flex, Form, Button, DatePicker, Select } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import type { FormProps } from 'antd';
import type { FieldType } from "./paciente.ts";
import { headerStyle } from '../assets/perfil';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

function Paciente() {
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    }
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout style={{ minHeight: '100%' }}>
            <Header style={headerStyle}>Sistema de agendamentos</Header>
            <Layout>
                <Sider width="20%">
                 
                </Sider>
                <Content>
                    <Flex wrap gap="large" justify='center' style={{ padding: 24 }}>
                        <Card title="Agendar consulta" style={{ maxWidth: 500, width: '100%'  }}>
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
                                <Form.Item
                                    label="Especialidade:"
                                    name="Select"
                                    rules={[{ required: true, message: 'Please input!' }]}
                                >
                                    <Select />
                                </Form.Item>
                                <Form.Item
                                    label="Médico:"
                                    name="Select"
                                    rules={[{ required: true, message: 'Please input!' }]}
                                >
                                    <Select />
                                </Form.Item>
                                <Form.Item<FieldType>
                                    label="Data:"
                                    name="dataConsulta"
                                    getValueProps={(value) => ({ value: value ? dayjs(value) : undefined })}
                                    getValueFromEvent={(e) => e?.format("DD/MM/YYYY")}
                                    rules={[{ required: true, message: 'Please input your date!' }]}
                                >
                                    <DatePicker format={"DD/MM/YYYY"} />
                                </Form.Item>
                                <Form.Item label={null}>
                                    <Button type="primary" htmlType="submit">
                                        Agendar
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                        <Card title="Seus agendamentos" style={{ maxWidth: 500, width: '100%'  }}>

                        </Card>
                    </Flex>
                </Content>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Douglas Hernandes © 2026 </Footer>
        </Layout>
    )
}
export default Paciente;