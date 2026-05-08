import { Layout, Flex, Button, Typography } from 'antd';
const { Header, Content, Footer } = Layout;
import { headerStyle } from '../assets/perfil';
import { Link } from 'react-router-dom';
const { Title, Paragraph } = Typography;
import { HeartFilled } from '@ant-design/icons';

function Home() {

    return (
        <Layout style={{ minHeight: '100%', background: '#f5f7fb' }}>
            <Header style={{
                ...headerStyle,
                ...headerStyle,
                background: '#1677ff',
                padding: '0 40px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <Flex justify='space-between' align='center' >
                    <div style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
                        Sistema de agendamentos
                    </div>
                    <Flex gap='small' >
                        <Button type='link'>
                            <Link to="/login" style={{ color: '#fff', fontWeight: 500 }}>Login</Link>
                        </Button>
                        <Button type='primary'>
                            <Link to="/cadastro" style={{ color: '#fff', fontWeight: 500 }}>Cadastro</Link>
                        </Button>
                    </Flex>
                </Flex>
            </Header>
            <Layout>
                <Content style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px'
                }}>
                    <div
                        style={{
                            maxWidth: 700,
                            textAlign: 'center'
                        }}
                    >
                        <HeartFilled
                            style={{
                                fontSize: 70,
                                color: '#1677ff',
                                marginBottom: 24
                            }}
                        />

                        <Title
                            style={{
                                fontSize: 42,
                                marginBottom: 16,
                                color: '#1f1f1f'
                            }}
                        >
                            Sistema de Agendamentos Médicos
                        </Title>

                        <Paragraph
                            style={{
                                fontSize: 18,
                                color: '#595959',
                                lineHeight: 1.8
                            }}
                        >
                            Plataforma moderna para gerenciamento de consultas,
                            organização de horários e atendimento de pacientes
                            com praticidade e segurança.
                        </Paragraph>
                        <Flex wrap gap="large" justify='center' style={{ padding: 24 }}>
                        </Flex>
                    </div>
                </Content>
            </Layout>
            <Footer style={{
                    textAlign: 'center',
                    background: '#001529',
                    color: '#fff'
                }}>Douglas Hernandes © 2026 </Footer>
        </Layout>

    )
}
export default Home;