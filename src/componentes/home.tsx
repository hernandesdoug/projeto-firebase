import { Layout, Flex, Button } from 'antd';
const { Header, Content, Footer } = Layout;
import { headerStyle } from '../assets/perfil';
import { Link } from 'react-router-dom';

function Home() {

    return (
        <Layout style={{ minHeight: '100%'}}>
            <Header style={headerStyle}>
                <Flex justify='space-between' align='center' >
                    <div style={{ color: '#fff', fontSize: 18 }}>
                        Sistema de agendamentos
                    </div>
                    <Flex gap='small' >
                        <Button type='link'>
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button type='primary'>
                            <Link to="/cadastro">Cadastro</Link>
                        </Button>
                    </Flex>
                </Flex>
            </Header>
            <Layout>
                <Content>
                    <Flex wrap gap="large" justify='center' style={{ padding: 24 }}>
                    </Flex>
                </Content>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Douglas Hernandes © 2026 </Footer>
        </Layout>

    )
}
export default Home;