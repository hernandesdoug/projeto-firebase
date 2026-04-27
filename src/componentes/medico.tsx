import { Layout, Card, Flex } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { headerStyle } from '../assets/perfil';

function Medico() {

    return (
        <Layout style={{minHeight: '100%'}}>
            <Header  style={headerStyle}>Sistema de agendamentos</Header>
            <Layout>
                <Sider width="25%"></Sider>
                <Content>
                    <Flex wrap gap="large" justify='center' style={{ padding: 24 }}>

                        <Card title="Crie sua agenda" style={{ width: 320 }}>

                        </Card>
                        <Card title="Consultas agendadas" style={{ width: 320 }}>

                        </Card>
                    </Flex>
                </Content>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Douglas Hernandes © 2026 </Footer>
        </Layout>
    )
}
export default Medico;