import api from "./plugins/axios/api";
import './Main.css'
import {Content} from "antd/es/layout/layout";
import Avatar from "antd/es/avatar/avatar";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {
    Alert,
    Button,
    Card,
    Comment,
    Spin,
    DatePicker,
    Form,
    Input,
    Rate,
    Result,
    Select,
    Switch,
    Tooltip,
    message
} from "antd";
import "antd/dist/antd.css";
import Meta from "antd/es/card/Meta";
import Modal from "antd/es/modal/Modal";
import {PlusOutlined} from "@ant-design/icons";
import Error from "./FailedPage/Error";
import {YearSelect, MonthSelect, DaySelect} from 'ru-react-select';
import moment from "moment";
const { TextArea } = Input;

function Main() {
    const { Option } = Select;
    const { TextArea } = Input;
    const params = useParams();
    let [userData, setUserData] = useState([])
    let [servicesData, setServicesData] = useState([])
    let [feedbackData, setFeedbackData] = useState([])
    let [feedbackV, setFeedbackV] = useState(false)
    let [modalV, setModalV] = useState(false)
    let [successModalV, setSuccessModalV] = useState(false)
    let [errorModal, setErrorModal] = useState(false)
    let [selectedService, setSelectedService] = useState("")
    let [commentHolder, setCommentHolder] = useState(null)
    let [nameHolder, setNameHolder] = useState('')
    let [phoneHolder, setPhoneHolder] = useState('')
    let [emailHolder, setEmailHolder] = useState('')
    let [selectedDate, setSelectedDate] = useState(null)
    let [selectedTime, setSelectedTime] = useState(null)
    let [timeData, setTimeData] = useState([])
    let [notWorking, setNotWorking] = useState(false)
    let [recordCheck, setRecordCheck] = useState(true)
    let [nameFeedHolder,setNameFeedHolder] = useState(null)
    let [phoneFeedHolder,setPhoneFeedHolder] = useState(null)
    let [gradeFeedHolder,setGradeFeedHolder] = useState(null)
    let [commentFeedHolder,setCommentFeedHolder] = useState('')
    let [checkFeedHolder,setCheckFeedHolder] = useState(true)
    let [successFeedModalV, setSuccessFeedModalV] = useState(false)
    let [yHolder,setYHolder] = useState(moment().year())
    let [mHolder,setMHolder] = useState("")
    let [dHolder,setDHolder] = useState('')
    let [isLoading,setIsLoading] = useState(false)

    
    
    async function loadData() {
        setIsLoading(true)
       await api(`portfolio/user_landing/master/?mst=${params.id}`)
            .then((response)=>{
                setUserData(response.data[0])
                setIsLoading(false)
            })
            .catch((e)=>{
                if (e.response.status === 500){
                    setErrorModal(true)
                }
            })
        await api(`portfolio/user_landing/services/?mst=${params.id}`)
            .then((response)=>{
                setServicesData(response.data)
            })
        await api(`portfolio/user_landing/grades/?mst=${params.id}`)
            .then((response)=>{
                setFeedbackData(response.data)
            })
        setIsLoading(false)
    }

    useEffect(()=>{
       loadData()
    },[])
    useEffect(()=>{
        api(`portfolio/user_landing/free_time/?sv=${selectedService}&d=${dHolder + '.' + mHolder + '.' + yHolder}`)
            .then((response)=>{
                if (response.status === 200) {
                    setTimeData(response.data.times)
                    setNotWorking(false)
                    setSelectedDate(dHolder + '.' + mHolder + '.' + yHolder)
                }
            })
            .catch((err)=>{

                if (err.response.status === 400){
                    setTimeData([])
                    setSelectedDate(null)
                    setNotWorking(true)
                }
            })
    },[selectedService,mHolder,dHolder,yHolder])
    function sendRecord(){
        api.post('portfolio/user_landing/create_record/',
            {
                name: nameHolder,
                phone: '+7' + phoneHolder,
                service: selectedService,
                date: selectedDate,
                time: selectedTime,
                comment: commentHolder
            })
            .then((response)=>{
                if (response.status === 201){
                    setFeedbackV(false)
                    setSuccessModalV(true)
                    clearForms()
                    setTimeout(() => {
                        setSuccessModalV(false)
                    }, 3000);
                }
            })
            .catch((err)=>{
                if (err.response.status === 400) {
                    console.log(err.response)
                    error(err.response.data.detail)
                }
            })
    }

    function sendFeedback(){
        console.log('feed')
        api.post('portfolio/user_landing/send_grade/',
            {
                name: nameFeedHolder,
                phone: '+7' + phoneFeedHolder,
                comment: commentFeedHolder,
                grade: gradeFeedHolder,
                assessed: params.id,
            })
            .then((response)=>{
                if (response.status === 200){
                    setModalV(false)
                    setSuccessFeedModalV(true)
                    setTimeout(() => {
                        setSuccessFeedModalV(false)
                    }, 3000);
                }
            })
            .catch((err) => {
                if (err.response.status === 403 ){
                    error(err.response.data.detail)
                }
            })
    }

    function clearForms(){
        setNameHolder('')
        setPhoneHolder('')
        setEmailHolder('')
        setSelectedService('')
        setSelectedDate(null)
        setSelectedTime('')
        setCommentHolder('')
    }

    const error = (text) => {
        message.error(text);
    }
    useEffect(()=>{
        setSelectedTime(selectedTime)
        console.log(selectedTime)
    }, [selectedTime])

    return (
        <Spin spinning={isLoading}>
    <Content className={isLoading ? 'main-container loading' : 'main-container'}>
            <div className={'img-block'}>
                <img src={userData.avatar} alt=""/>
            </div>

            <span className={'name-title'}>{userData.first_name} {userData.last_name}</span>
            <Tooltip placement="right" title={userData.rating}>
            <div>
            <Rate disabled value={userData.rating} allowHalf/>
            </div>
            </Tooltip>
            <Button  onClick={() => {
            setFeedbackV(true)
        }} size={'large'} className={'service-button'}>Записаться</Button>
            <span className={'services-title'}>Услуги</span>
            <div className={'services-list'}>
        {servicesData.map(item => (
            <Card
            key={item.id}
            onClick={() => {
            setSelectedService(item.id)
            setFeedbackV(true)
        }}
            className={'card'}
            hoverable={true}
            cover={
            <img
            alt="example"
            src={item.img}
            className={'card-img'}
            />
        }>
            <Meta
            className={'card-text'}
            title={item.name}
            description={item.description}
            />
            <div className={'card-price'}>{item.cost} руб.</div>

            </Card>
            ))}


            </div>
            <div className={'feedback-title'}><span>Отзывы</span> <Button onClick={() => {
            setModalV(true)
        }} className={'feedback_add-btn'} type="primary" shape="circle" icon={<PlusOutlined/>}/></div>

            <Card className={'feedback-list'}>
        {feedbackData.map(item => (
            <Comment
            key={item.id}
            className={'comment-item'}
            author={<a>{item.client}</a>}
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={item.client}/>}
            content={
            <p>
        {item.comment}
            </p>
        }
            datetime={
            <Tooltip title={item.created}>
            <span>{item.created}</span>
            </Tooltip>
        }

            >
            <Tooltip placement="left" title={item.grade}>
            <div className={'comment-grade-div'}>
            <Rate disabled value={item.grade}></Rate>
            </div>
            </Tooltip>
            </Comment>
            ))}
            </Card>


            <Modal className={'modal-record'} footer={null} onCancel={() => {
            setFeedbackV(false)
        }} title="Запись" visible={feedbackV}>
            <Form onFinish={sendRecord} className={'service-form'}>
            <Input value={nameHolder} htmlType={'text'} onChange={((e) => {
            setNameHolder(e.target.value)
        })} required className={'form-input'} placeholder="Имя"/>
            <Input id={'phone-input'} value={phoneHolder} onChange={((e) => {
            setPhoneHolder(e.target.value)
        })} required placeholder={'Номер телефона'} className={'form-input'} addonBefore={'+7'}/>
            <Input value={emailHolder} htmlType={'email'} onChange={((e) => {
            setEmailHolder(e.target.value)
        })}  placeholder={'Почта'} className={'form-input'}/>
            <select value={selectedService} required onChange={(e) => {
            setSelectedService(e.target.value)
        }}
            className={'ant-input form-input email-select'}>
            <option selected disabled className={'pre-selected'} value={""}>Услуга</option>
        {servicesData.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
            ))}
            </select>
            <div className={'dates-block'}>
            <select required value={dHolder} className={'dates-item email-select form-input'} onChange={(e) => {
            setDHolder(e.target.value)
        }} name="day">
            <option disabled selected value="">День</option>
            <option value="01">1</option>
            <option value="02">2</option>
            <option value="03">3</option>
            <option value="04">4</option>
            <option value="05">5</option>
            <option value="06">6</option>
            <option value="07">7</option>
            <option value="08">8</option>
            <option value="09">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
            </select>
            <select required value={mHolder} className={'dates-item email-select form-input'} onChange={(e) => {
            setMHolder(e.target.value)
        }} name="month">
            <option selected disabled value="">Месяц</option>
            <option value="01">Январь</option>
            <option value="02">Февраль</option>
            <option value="03">Март</option>
            <option value="04">Апрель</option>
            <option value="05">Май</option>
            <option value="06">Июнь</option>
            <option value="07">Июль</option>
            <option value="08">Август</option>
            <option value="09">Сентябрь</option>
            <option value="10">Октябрь</option>
            <option value="11">Ноябрь</option>
            <option value="12">Декарь</option>
            </select>
            <select required value={yHolder} className={'dates-item form-input'} onChange={(e) => {
            setYHolder(e.target.value)
        }} name="year">
            <option value="2038">2038</option>
            <option value="2037">2037</option>
            <option value="2036">2036</option>
            <option value="2035">2035</option>
            <option value="2034">2034</option>
            <option value="2033">2033</option>
            <option value="2032">2032</option>
            <option value="2031">2031</option>
            <option value="2030">2030</option>
            <option value="2029">2029</option>
            <option value="2028">2028</option>
            <option value="2027">2027</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            </select>
            </div>
        {notWorking &&
            <Alert className={'form-input'} message="Мастер не работает в этот день" type="error"/>
        }
        {timeData.length > 0 &&
            <div className={'time-block'}>
        {timeData.map(item => (
            <div onClick={() => {
            setSelectedTime(item)
        }} className={'time-item' + (selectedTime === item ? ' time-item__selected' : '')}
            key={item} value={item}>{item}</div>
            ))}
            </div>
        }
            <TextArea onChange={((e) => {
            setCommentHolder(e.target.value)
        })} placeholder="Комментарий" className={'form-input'} allowClear/>
            <div><Switch required checked={recordCheck} onChange={(e) => {
            setRecordCheck(e)
        }} className={'form-switch'}/> Согласен(-а) на обработку данных *
            </div>
            <div className="form-buttons">
            <Button className={"submit-button"} onClick={() => {
            setFeedbackV(false)
        }}>Отмена</Button>
            <Button
            disabled={recordCheck === false || notWorking === true || nameHolder === '' || phoneHolder === '' || emailHolder === '' || selectedService === null || selectedDate === null || selectedTime === null}
            htmlType="submit">Создать</Button>

            </div>
            </Form>
            </Modal>


            <Modal footer={null} onCancel={() => {
            setModalV(false)
        }} title="Добавить отзыв" visible={modalV}>
            <Form onFinish={sendFeedback} className={'service-form'}>
            <Input onChange={(e) => {
            setNameFeedHolder(e.target.value)
        }} htmlType={'text'} required className={'form-input'} placeholder="Имя"/>
            <Input  id={'phone-input'} onChange={(e) => {
            setPhoneFeedHolder(e.target.value)
        }} required placeholder={'Номер телефона'} className={'form-input'} addonBefore={'+7'}/>
            <Rate onChange={(e) => {
            setGradeFeedHolder(e)
        }} required className={'feedback-rating '}/>
            <TextArea onChange={(e) => {
            setCommentFeedHolder(e.target.value)
        }} placeholder="Комментарий" className={'form-input'} allowClear/>
            <div><Switch value={checkFeedHolder} onChange={(e) => {
            setCheckFeedHolder(e)
        }} required defaultChecked className={'form-switch'}/> Согласен(-а) на обработку данных *
            </div>
            <div className="form-buttons">
            <Button id={'cancel-button'} className={"submit-button form-button cancel-button"} onClick={() => {
            setModalV(false)
        }}>Отмена</Button>
            <Button className={"form-button"} disabled={checkFeedHolder === false || gradeFeedHolder === null || phoneFeedHolder === null}
            htmlType="submit">Создать</Button>

            </div>
            </Form>
            </Modal>


            <Modal footer={null} onCancel={() => {
            setSuccessModalV(false)
        }} title="Успех" visible={successModalV}>
            <Result
            status="success"
            title="Запись"
            subTitle="Ваша запись успешно сформирована!"
            extra={[
            <Button onClick={() => {
            setSuccessModalV(false)
        }} type="primary" key="console">
            Закрыть
            </Button>,

            ]}
            />
            </Modal>

            <Modal footer={null} onCancel={() => {
            setSuccessFeedModalV(false)
        }} title="Успех" visible={successFeedModalV}>
            <Result
            status="success"
            title="Отзыв"
            subTitle="Ваш отзыв добавлен, спасибо!"
            extra={[
            <Button onClick={() => {
            setSuccessFeedModalV(false)
        }} type="primary" key="console">
            Закрыть
            </Button>,

            ]}
            />
            </Modal>


            <Modal closable={false} footer={null} visible={errorModal}>
            <Error></Error>
            </Modal>


    </Content>
        </Spin>

    );
}

export default Main;
