import { Layout, Card, Flex, Menu, Table } from 'antd';
import type { TableProps } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { headerStyle } from '../assets/perfil';
import { LogoutOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { Calendar } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase.ts";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

function Medico() {

    interface DataType {
        key: string;
        name: string;
        date: string;
        status: string;
    }
    const [data, setData] = useState<DataType[]>([]);
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => <a>{text}</a>,
        },
    ];
    const dataDia = new Date().toLocaleDateString('pt-BR');
    const navigate = useNavigate();
    const auth = getAuth();
    const onLogout = async () => {
        await signOut(auth);
        navigate("/login");
    }
    const onChangePassword = async () => {

    }
    const onEditProfile = async () => {

    }
    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    const getAgenda = async () => {
        const ref = collection(db, "agendamentos");
        const snapshot = await getDocs(ref);

        const lista: DataType[] = snapshot.docs.map((doc) => {
            const dados = doc.data();

            return {
                key: doc.id,
                name: dados.nomePaciente,
                date: dados.dataAgendamento,
                status: dados.status,
            };
        })
        setData(lista);
    }

    useEffect(() => {
        getAgenda()
    }, []);

    return (
        <Layout style={{ minHeight: '100%' }}>
            <Header style={headerStyle}>Sistema de agendamentos</Header>
            <Layout>
                <Sider width="15%">
                    <Menu
                        mode="inline"
                        style={{ height: "100%", borderRight: 0 }}
                        onClick={({ key }) => {
                            if (key === "logout") onLogout();
                            if (key === "password") onChangePassword();
                            if (key === "profile") onEditProfile();
                        }}
                        items={[
                            {
                                key: "profile",
                                icon: <UserOutlined />,
                                label: "Alterar Perfil",
                            },
                            {
                                key: "password",
                                icon: <LockOutlined />,
                                label: "Trocar Senha",
                            },
                            {
                                key: "logout",
                                icon: <LogoutOutlined />,
                                label: "Logout",
                                danger: true,
                            },
                        ]}
                    />
                </Sider>
                <Content>
                    <Flex wrap gap="large" justify='center' style={{ padding: 24 }}>
                        <Card title="Sua disponibilidade" style={{ maxWidth: 500, width: '100%' }}>
                            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                        </Card>
                        <Card title={`Agenda do dia - ${dataDia}`} style={{ maxWidth: 500, width: '100%' }}>
                            <Table<DataType> columns={columns} dataSource={data} />
                        </Card>
                    </Flex>
                </Content>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Douglas Hernandes © 2026 </Footer>
        </Layout>
    )
}
export default Medico;