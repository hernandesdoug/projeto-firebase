import { Layout, Card, Flex } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { headerStyle } from '../assets/perfil';
import { Calendar } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';

function Medico() {
    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };
    return (
        <Layout style={{ minHeight: '100%' }}>
            <Header style={headerStyle}>Sistema de agendamentos</Header>
            <Layout>
                <Sider width="15%"></Sider>
                <Content>
                    <Flex wrap gap="large" justify='center' style={{ padding: 24 }}>
                        <Card title="Sua disponibilidade" style={{ maxWidth: 500, width: '100%'  }}>
                            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                        </Card>
                        <Card title="Agenda do dia XX-XX-XXXX" style={{ maxWidth: 500, width: '100%'  }}>

                        </Card>
                    </Flex>
                </Content>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Douglas Hernandes © 2026 </Footer>
        </Layout>
    )
}
export default Medico;