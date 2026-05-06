import { Layout, Card, Flex, Form, Button, DatePicker, TimePicker, Select, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import type { FormProps } from 'antd';
import type { FieldType } from "./paciente.ts";
import { LogoutOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { headerStyle } from '../assets/perfil';
import dayjs from 'dayjs';
import { db } from "../services/firebase.ts";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function Paciente() {
    const [loading, setLoading] = useState(false);
    const [consultas, setConsulta] = useState<FieldType[]>([]);
    const [especialidades, setEspecialidades] = useState<any[]>([]);
    const [medicos, setMedicos] = useState<any[]>([]);
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
    const getConsulta = async (idPaciente: string) => {
        setLoading(true);
        const ref = collection(db, "agendamentos");
        const q = query(
            ref,
            where("idPaciente", "==", idPaciente),
            where("status", "==", "agendado"),
        );
        console.log("IdPaciente:", idPaciente);
        const snapshot = await getDocs(q);
    
        const lista = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as FieldType)
        })) ;
         console.log("Resultados:", lista);
        setConsulta(lista);
      
        setLoading(false);
    }
    const getEspecialidades = async () => {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "especialidades"));
        const lista = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        const options = lista.map((item: any) => ({ value: item.id, label: item.nomeEspecialidade }))
        setEspecialidades(options);
        setLoading(false);
    }
    const getMedicos = async (idEspecialidade: string) => {
        setLoading(true);
        const ref = collection(db, "usuarios");
        const q = query(
            ref,
            where("idEspecialidade", "==", idEspecialidade),
        );
        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const options = lista.map((item: any) => ({ value: item.id, label: item.nomeCompleto }))
        setMedicos(options);
        setLoading(false);
    }
    useEffect(() => {
        getEspecialidades();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                getConsulta(user.uid);
            } else {
                console.log("Usuário não logado");
            }
        });
        return () => unsubscribe();
    }, []);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        const user = auth.currentUser;
        const { especialidade,
            nomeMedico,
            dataConsulta,
            horaConsulta } = values;
        try {
            const medico = medicos.find( (item) => item.value === nomeMedico);
            const especialidadeMedico = especialidades.find( (item) => item.value === especialidade); 
            await addDoc(collection(db, "agendamentos"), {
                dataConsulta, horaConsulta, nomeMedico: medico.label, especialidade: especialidadeMedico.label,
                idPaciente: user?.uid, idMedico: nomeMedico, status: "agendado", idEspecialidade: especialidade
            });
            toast.success("Consulta agendada com sucesso!");
        } catch (error) {
            console.log(error);
            toast.error("Erro ao agendar!");
        } finally {
            setLoading(false);
        }
    }
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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
                        <Card title="Agendar consulta" style={{ maxWidth: 500, width: '100%' }}>
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
                                    name="especialidade"
                                    rules={[{ required: true, message: 'Please input!' }]}
                                >
                                    <Select placeholder="Selecione uma especialidade"
                                        options={especialidades}
                                        onChange={getMedicos}
                                        loading={loading}
                                        disabled={loading}
                                    />

                                </Form.Item>
                                <Form.Item
                                    label="Médico:"
                                    name="nomeMedico"
                                    rules={[{ required: true, message: 'Please input!' }]}
                                >
                                    <Select placeholder="Selecione uma médico"
                                        options={medicos}
                                        loading={loading}
                                        disabled={loading}
                                    />
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
                                <Form.Item<FieldType>
                                    label="Hora:"
                                    name="horaConsulta"
                                    getValueProps={(value) => ({ value: value ? dayjs(value, "HH:mm") : undefined })}
                                    getValueFromEvent={(time) => time?.format("HH:mm")}
                                    rules={[{ required: true, message: 'Please input your time!' }]}
                                >
                                    <TimePicker format="HH:mm" />
                                </Form.Item>
                                <Form.Item label={null}>
                                    <Button type="primary" htmlType="submit" loading={loading}
                                        disabled={loading}>
                                        Agendar
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                        <Card title="Seus agendamentos" style={{ maxWidth: 500, width: '100%' }}>
                            {consultas.length > 0 ? (
                                consultas.map((consulta, index) => (
                                    <div key={index}>
                                        <p><strong>Paciente:</strong> {consulta.nomePaciente}</p>
                                        <p><strong>Data:</strong> {consulta.dataConsulta}</p>
                                        <p><strong>Hora:</strong> {consulta.horaConsulta}</p>
                                        <p><strong>Status:</strong> {consulta.status}</p>
                                        <p><strong>Médico:</strong> {consulta.nomeMedico}</p>
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma consulta agendada</p>
                            )}
                        </Card>
                    </Flex>
                </Content>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Douglas Hernandes © 2026 </Footer>
        </Layout>
    )
}
export default Paciente;