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
    DatePicker,
    Form,
    Input,
    Rate, Result,
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
    let [commentHolder, setCommentHolder] = useState('')
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
    let [commentFeedHolder,setCommentFeedHolder] = useState(null)
    let [checkFeedHolder,setCheckFeedHolder] = useState(true)
    let [successFeedModalV, setSuccessFeedModalV] = useState(false)


    useEffect(()=>{
        api(`portfolio/user_landing/master/?mst=${params.id}`)
            .then((response)=>{
                setUserData(response.data[0])
            })
            .catch((e)=>{
                if (e.response.status === 500){
                    setErrorModal(true)
                }
            })
        api(`portfolio/user_landing/services/?mst=${params.id}`)
            .then((response)=>{
                setServicesData(response.data)
            })
        api(`portfolio/user_landing/grades/?mst=${params.id}`)
            .then((response)=>{
                setFeedbackData(response.data)
            })
    },[])
    useEffect(()=>{
        api(`portfolio/user_landing/free_time/?sv=${selectedService}&d=${selectedDate}`)
            .then((response)=>{
                if (response.status === 200) {
                    setTimeData(response.data.times)
                    setNotWorking(false)
                }
            })
            .catch((err)=>{

                if (err.response.status === 400){
                    setTimeData([])
                    setSelectedDate(null)
                    setNotWorking(true)
                }
            })
    },[selectedService,selectedDate])
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

    return (

            <Content className={'main-container'}>
                <div className={'img-block'}>
                    <img src={"http://everyservices.itpw.ru/" + userData.avatar} alt=""/>
                </div>
                <span className={'name-title'}>{userData.first_name} {userData.last_name}</span>
                <Tooltip  placement="right" title={userData.rating}>
                <div>
                <Rate disabled  value={userData.rating}  allowHalf  />
                </div>
                </Tooltip>
                <Button onClick={()=>{setFeedbackV(true)}}  size={'large'} className={'service-button'} >Записаться</Button>
                <span className={'services-title'}>Услуги</span>
<div className={'services-list'}>
                {servicesData.map(item => (
                            <Card
                                key={item.id}
                                onClick={()=>{
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
                <div className={'feedback-title'}><span >Отзывы</span> <Button onClick={()=>{setModalV(true)}} className={'feedback_add-btn'} type="primary" shape="circle" icon={<PlusOutlined />} /></div>

                <Card className={'feedback-list'}>
                    {feedbackData.map(item => (
                    <Comment
                        key={item.id}
                        className={'comment-item'}
                        author={<a>{item.client}</a>}
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={item.client} />}
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
                        <Tooltip  placement="left" title={item.grade}>
                        <div className={'comment-grade-div'}>
                        <Rate disabled value={item.grade}></Rate>
                        </div>
                        </Tooltip>
                    </Comment>
                    ))}
                </Card>


                <Modal footer={null} onCancel={()=>{setFeedbackV(false)}} title="Запись" visible={feedbackV} >
                    <Form  onFinish={sendRecord} className={'service-form'}>
                    <Input value={nameHolder} htmlType={'text'} onChange={((e)=>{setNameHolder(e.target.value)})} required className={'form-input'} placeholder="Имя" />
                    <Input value={phoneHolder} onChange={((e)=>{setPhoneHolder(e.target.value)})} required placeholder={'Номер телефона'} className={'form-input'} addonBefore={'+7'}  />
                    <Input value={emailHolder} htmlType={'email'} onChange={((e)=>{setEmailHolder(e.target.value)})} required placeholder={'Почта'} className={'form-input'} />
                        <select value={selectedService} required onChange={(e)=>{
                            setSelectedService(e.target.value)}}
                                className={'ant-input form-input email-select'}  >
                            <option selected disabled className={'pre-selected'} value={""}>Услуга</option>
                            {servicesData.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                        </select>

                        <DatePicker type={'date'} required disabled={selectedService === ""} onChange={(e)=>{setSelectedDate(e._d.toLocaleDateString('ru-RU'))}}  format={'DD.MM.YYYY'} className={'form-input'} placeholder={'Дата'}/>
                        {notWorking &&
                            <Alert className={'form-input'} message="Мастер не работает в этот день" type="error"/>
                        }
                        <select required disabled={ timeData.length === 0 } onChange={
                            (e)=>{
                                setSelectedTime(e.target.value)}}
                                className={'ant-input form-input email-select'} placeholder={'Время'}  >
                            <option disabled selected className={'pre-selected'} value="">Время</option>
                            {timeData.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                        <TextArea  onChange={((e)=>{setCommentHolder(e.target.value)})} placeholder="Комментарий" className={'form-input'} allowClear/>

                   <div> <Switch  required checked={recordCheck} onChange={(e)=>{setRecordCheck(e)}} className={'form-switch'} /> Согласен(-а) на обработку данных *</div>
                        <div className="form-buttons">
                        <Button className={"submit-button"}  disabled={recordCheck === false || notWorking === true || nameHolder === '' || phoneHolder === '' || emailHolder === '' || selectedService === null || selectedDate === null || selectedTime === null} htmlType="submit">Создать</Button>
                        <Button onClick={()=>{setFeedbackV(false)}}>Отмена</Button>
                        </div>
                    </Form>
                </Modal>




                <Modal footer={null} onCancel={()=>{setModalV(false)}} title="Добавить отзыв" visible={modalV} >
                    <Form onFinish={sendFeedback}  className={'service-form'}>
                        <Input onChange={(e)=>{setNameFeedHolder(e.target.value)}}  htmlType={'text'} required className={'form-input'} placeholder="Имя" />
                        <Input onChange={(e)=>{setPhoneFeedHolder(e.target.value)}} required placeholder={'Номер телефона'} className={'form-input'} addonBefore={'+7'}  />
                        <Rate onChange={(e)=>{setGradeFeedHolder(e)}} required className={'feedback-rating '}   />
                        <TextArea onChange={(e)=>{setCommentFeedHolder(e.target.value)}}  placeholder="Комментарий" className={'form-input'} allowClear/>
                        <div> <Switch value={checkFeedHolder} onChange={(e)=>{setCheckFeedHolder(e)}} required  defaultChecked  className={'form-switch'}   /> Согласен(-а) на обработку данных *</div>
                        <div className="form-buttons">
                            <Button disabled={ checkFeedHolder === false || gradeFeedHolder === null || phoneFeedHolder === null} className={"submit-button"} htmlType="submit">Создать</Button>
                            <Button onClick={()=>{setModalV(false)}}>Отмена</Button>
                        </div>
                    </Form>
                </Modal>



                <Modal footer={null} onCancel={()=>{setSuccessModalV(false)}} title="Успех" visible={successModalV} >
                    <Result
                        status="success"
                        title="Запись"
                        subTitle="Ваша запись успешно сформирована!"
                        extra={[
                            <Button onClick={()=>{ setSuccessModalV(false)}} type="primary" key="console">
                              Закрыть
                            </Button>,

                        ]}
                    />
                </Modal>

                <Modal footer={null} onCancel={()=>{setSuccessFeedModalV(false)}} title="Успех" visible={successFeedModalV} >
                    <Result
                        status="success"
                        title="Отзыв"
                        subTitle="Ваш отзыв добавлен, спасибо!"
                        extra={[
                            <Button onClick={()=>{ setSuccessFeedModalV(false)}} type="primary" key="console">
                                Закрыть
                            </Button>,

                        ]}
                    />
                </Modal>



                <Modal closable={false} footer={null}  visible={errorModal}>
                    <Error></Error>
                </Modal>


            </Content>


    );
}

export default Main;
