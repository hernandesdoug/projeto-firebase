import { Layout, Card, Flex, Menu, Table, DatePicker, TimePicker, Button, Space, message } from 'antd';
import type { TableProps } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { headerStyle } from '../assets/perfil';
import { LogoutOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import type { Dayjs } from 'dayjs';
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase.ts";
import { getAuth, signOut } from "firebase/auth";
import { collection, addDoc, getDocs } from 'firebase/firestore';
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
    const [selecionaDatas, setSelecionaDatas] = useState<Dayjs[]>([]);
    const [horaInicio, setHoraInicio] = useState<Dayjs | null>(null);
    const [horaFinal, setHoraFinal] = useState<Dayjs | null>(null);
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

    const geraHorario = () => {
        const horarios = [];
        let horaAtual = horaInicio;
        while (horaAtual?.isBefore(horaFinal)) {
            horarios.push({
                hora: horaAtual.format("HH:mm"),
                status: "disponível"
            })
            horaAtual = horaAtual.add(30, "minute");
        }
        return horarios;
    };
    const addAgenda = async () => {
        const horarios = geraHorario();
        for (const data of selecionaDatas) {
            await addDoc(collection(db, "agendaMedico"), {
                data: data.format("DD/MM/YYYY"),
                horarios
            });
        }
        message.success("Agenda cadastrada com sucesso")
        setSelecionaDatas([]);
        setHoraInicio(null);
        setHoraFinal(null);
    }
    const getAgenda = async () => {
        const ref = collection(db, "agendamentos");
        const snapshot = await getDocs(ref);

        const lista: DataType[] = snapshot.docs.map((doc) => {
            const dados = doc.data();

            return {
                key: doc.id,
                name: dados.nomePaciente,
                date: dados.dataConsulta,
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
                            <Space direction="vertical" size={'middle'} style={{ width: "100%" }}>
                                <div style={{ width: '100%' }}>
                                    <label style={{ display: "block", marginBottom: 8 }}>
                                        Datas disponíveis
                                    </label>
                                    <DatePicker
                                        multiple
                                        format="DD/MM/YYYY"
                                        value={selecionaDatas}
                                        onChange={(dates) => setSelecionaDatas(dates || [])}
                                        style={{ width: "100%" }}
                                        placeholder='Selecione as datas'
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block' }}>Hora Inicio</label>
                                    <TimePicker
                                        format="HH:mm"
                                        value={horaInicio}
                                        onChange={(time) => setHoraInicio(time)}
                                        placeholder='Selecione a hora inicio'
                                    />
                                    <label style={{ display: 'block' }}>Hora Final</label>
                                    <TimePicker
                                        format="HH:mm"
                                        value={horaFinal}
                                        onChange={(time) => setHoraFinal(time)}
                                        placeholder='Selecione a hora final'
                                    />
                                </div>
                                <Button type="primary" onClick={addAgenda} style={{ marginTop: 8 }}>
                                    Salvar agenda
                                </Button>
                            </Space>
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