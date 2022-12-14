import api from "../plugins/axios/api";
import {Content} from "antd/es/layout/layout";
import Avatar from "antd/es/avatar/avatar";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import { useSearchParams } from "react-router-dom";
import {
    Alert,
    Button,
    Card,
    Comment,
    Spin,
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
import '../scss/Main.scss';
import Meta from "antd/es/card/Meta";
import Modal from "antd/es/modal/Modal";
import {PlusOutlined} from "@ant-design/icons";
import Error from "../components/FailedPage/Error";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {getMastersShedule} from '../store/mainSlice';
import image from '../media/image_not_found.svg'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from "date-fns/locale/ru";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';

const { TextArea } = Input;

function Main() {
    const [value, onChange] = useState(new Date());
    //const {user} = useSelector((state)=> state.main)   
    const dispatch = useDispatch(); 
    const {shedulesMaster} = useSelector(state => state.main)
    //dispatch(addUser(params))
    const [searchParams, setSearchParams] = useSearchParams();
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
    let [selectedDate, setSelectedDate] = useState(null)
    let [selectedTime, setSelectedTime] = useState(null)
    let [timeData, setTimeData] = useState([])
    let [notWorking, setNotWorking] = useState(false)
    let [notSetService, setNotSetService] = useState(false);
    let [notSetComment, setNotSetComment] = useState(false);
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

    const [loadDate, setIsLoadDate] = useState(null)
    const [sendData, setSendData] = useState(false);
    // this is day array

    const [arrayHolder, setArrayHolder] = useState([
        moment().year(),
        moment().year() + 1
    ])
    const [arrayMHolder, setArrayMHolder] = useState([])   

    const checkImagePromise = ( url ) => new Promise( (resolve, reject ) => {
        let img = new Image();
            img.addEventListener('load', resolve );
            img.addEventListener('error', reject );
            img.src = url;
    });

    const loadData = async ()=>{
        let paramsNew = searchParams.get('id')
        if(paramsNew){

        }
        else{
            setErrorModal(true)
        }
        setIsLoading(true)
        await api(`portfolio/user_landing/master/?mst=${searchParams.get('id')}`)
       .then((response)=>{
            console.log(response);
           setUserData(response.data[0])
           setIsLoading(false)
       })
       .catch((e)=>{
           if (e.response.status === 500 || e.response.status === 403 || e.response.status === 404){
               setErrorModal(true)
           }
        })
        await api(`portfolio/user_landing/services/?mst=${searchParams.get('id')}`)
            .then((response)=>{
                setServicesData(response.data)
                let images = document.querySelectorAll('img');
                images.forEach( img => {
                    checkImagePromise( img.src )
                        .then( res => {
                            // ?? ?????????????????? ?????? ???? - ???????????? ???? ????????????
                        })
                        .catch( error => {
                            // ?? ?????????????????? ???????????? - ???????????? ????????????????
                            img.src = image;
                        });
                });
            })
        await api(`portfolio/user_landing/grades/?mst=${searchParams.get('id')}`)
            .then((response)=>{
                setFeedbackData(response.data)
            })
        setIsLoading(false)
    }

    useEffect(()=>{
       loadData()
    },[])
    useEffect(()=>{
        if(mHolder !== '' && dHolder !== '' && selectedService){
            setIsLoadDate(true);
            api(`portfolio/user_landing/free_time/?sv=${selectedService}&d=${dHolder + '.' + mHolder + '.' + yHolder}`)
            .then((response)=>{
                if (response.status === 200) {
                    setTimeData(response.data.times)
                    setNotWorking(false)
                    setSelectedDate(mHolder + '.' + dHolder + '.' + yHolder)
                    setNotSetService(false)
                }
            })
            .catch((err)=>{

                if (err.response.status === 400){
                    setTimeData([])
                    //setSelectedDate(null)
                    setNotWorking(true)
                }
                // if (err.response.status === 500){
                //     setNotSetService(true)
                // }
                else {
                    setNotSetService(false)
                }
            })
            .finally(()=>setIsLoadDate(null))
        }
    },[selectedService,mHolder,dHolder,yHolder])
    function sendRecord(){
        setSendData(true)
        api.post('portfolio/user_landing/create_record/',
            {
                name: nameHolder,
                phone: '+7' + phoneHolder,
                service: selectedService,
                date: `${dHolder}.${mHolder}.${yHolder}`,
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
                    error(err.response.data.detail)
                }
            })
            .finally(()=> {
                setTimeData('')
                setSendData(false)
            })
    }

    function sendFeedback(){
        api.post('portfolio/user_landing/send_grade/',
            {
                name: nameFeedHolder,
                phone: '+7' + phoneFeedHolder,
                comment: commentFeedHolder,
                grade: gradeFeedHolder,
                assessed: searchParams.get('id'),
            })
            .then((response)=>{
                console.log(response);
                if (response.status === 200){
                    setModalV(false)
                    setSuccessFeedModalV(true)
                    setFeedbackData([response.data, ...feedbackData])
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
        setSelectedService('')
        setSelectedDate(null)
        setSelectedTime('')
        setCommentHolder('')
        setNotSetService(false)
    }

    const error = (text) => {
        message.error(text);
    }
    useEffect(()=>{
        setSelectedTime(selectedTime)
    }, [selectedTime])    

    const getCurrentDay = (value)=>{
        if(value !== null) {
            let day = String(value).split(' ')[2]
            setDHolder(day)
            setMHolder(value.getMonth() + 1)
            setYHolder(String(value)?.split(' ')[3])
            // setSelectedDate(mHolder + '.' + dHolder + '.' + yHolder)
        }
    }
    useEffect(() => {
        console.log();
      dispatch(getMastersShedule({
        id: searchParams.get('id'),
        year: moment().year(),
        monthe: moment().month() + 1
      }))
      setMHolder(moment().month() + 1)
    }, [])
    
    const closeDatePicker = () => {
        dispatch(getMastersShedule({
            id: searchParams.get('id'),
            year: moment().year(),
            monthe: moment().month() + 1
          }))
    }

      const changeMonth = (month) => {
        let year = String(month).split(' ')[3]
        let current_month = month.getMonth()
        setDHolder('')
        setMHolder(month.getMonth() + 1)
        setYHolder(String(month).split(' ')[3])
        dispatch(getMastersShedule({
            id: searchParams.get('id'),
            year: year,
            monthe: current_month + 1,
        }))
      };

        function filterWeekends(date) {
        // !! dont look this strings )))
        return shedulesMaster[0]?.working === false && date.getTime() === new Date(`${shedulesMaster[0]?.date?.split('.')[2]}-${shedulesMaster[0]?.date?.split('.')[1]}-${shedulesMaster[0]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[1]?.working === false && date.getTime() === new Date(`${shedulesMaster[1]?.date?.split('.')[2]}-${shedulesMaster[1]?.date?.split('.')[1]}-${shedulesMaster[1]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[2]?.working === false && date.getTime() === new Date(`${shedulesMaster[2]?.date?.split('.')[2]}-${shedulesMaster[2]?.date?.split('.')[1]}-${shedulesMaster[2]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[3]?.working === false && date.getTime() === new Date(`${shedulesMaster[3]?.date?.split('.')[2]}-${shedulesMaster[3]?.date?.split('.')[1]}-${shedulesMaster[3]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[4]?.working === false && date.getTime() === new Date(`${shedulesMaster[4]?.date?.split('.')[2]}-${shedulesMaster[4]?.date?.split('.')[1]}-${shedulesMaster[4]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[5]?.working === false && date.getTime() === new Date(`${shedulesMaster[5]?.date?.split('.')[2]}-${shedulesMaster[5]?.date?.split('.')[1]}-${shedulesMaster[5]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[6]?.working === false && date.getTime() === new Date(`${shedulesMaster[6]?.date?.split('.')[2]}-${shedulesMaster[6]?.date?.split('.')[1]}-${shedulesMaster[6]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[7]?.working === false && date.getTime() === new Date(`${shedulesMaster[7]?.date?.split('.')[2]}-${shedulesMaster[7]?.date?.split('.')[1]}-${shedulesMaster[7]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[8]?.working === false && date.getTime() === new Date(`${shedulesMaster[8]?.date?.split('.')[2]}-${shedulesMaster[8]?.date?.split('.')[1]}-${shedulesMaster[8]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[9]?.working === false && date.getTime() === new Date(`${shedulesMaster[9]?.date?.split('.')[2]}-${shedulesMaster[9]?.date?.split('.')[1]}-${shedulesMaster[9]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[10]?.working === false && date.getTime() === new Date(`${shedulesMaster[10]?.date?.split('.')[2]}-${shedulesMaster[10]?.date?.split('.')[1]}-${shedulesMaster[10]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[11]?.working === false && date.getTime() === new Date(`${shedulesMaster[11]?.date?.split('.')[2]}-${shedulesMaster[11]?.date?.split('.')[1]}-${shedulesMaster[11]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[12]?.working === false && date.getTime() === new Date(`${shedulesMaster[12]?.date?.split('.')[2]}-${shedulesMaster[12]?.date?.split('.')[1]}-${shedulesMaster[12]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[13]?.working === false && date.getTime() === new Date(`${shedulesMaster[13]?.date?.split('.')[2]}-${shedulesMaster[13]?.date?.split('.')[1]}-${shedulesMaster[13]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[14]?.working === false && date.getTime() === new Date(`${shedulesMaster[14]?.date?.split('.')[2]}-${shedulesMaster[14]?.date?.split('.')[1]}-${shedulesMaster[14]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[15]?.working === false && date.getTime() === new Date(`${shedulesMaster[15]?.date?.split('.')[2]}-${shedulesMaster[15]?.date?.split('.')[1]}-${shedulesMaster[15]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[16]?.working === false && date.getTime() === new Date(`${shedulesMaster[16]?.date?.split('.')[2]}-${shedulesMaster[16]?.date?.split('.')[1]}-${shedulesMaster[16]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[17]?.working === false && date.getTime() === new Date(`${shedulesMaster[17]?.date?.split('.')[2]}-${shedulesMaster[17]?.date?.split('.')[1]}-${shedulesMaster[17]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[18]?.working === false && date.getTime() === new Date(`${shedulesMaster[18]?.date?.split('.')[2]}-${shedulesMaster[18]?.date?.split('.')[1]}-${shedulesMaster[18]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[19]?.working === false && date.getTime() === new Date(`${shedulesMaster[19]?.date?.split('.')[2]}-${shedulesMaster[19]?.date?.split('.')[1]}-${shedulesMaster[19]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[20]?.working === false && date.getTime() === new Date(`${shedulesMaster[20]?.date?.split('.')[2]}-${shedulesMaster[20]?.date?.split('.')[1]}-${shedulesMaster[20]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[21]?.working === false && date.getTime() === new Date(`${shedulesMaster[21]?.date?.split('.')[2]}-${shedulesMaster[21]?.date?.split('.')[1]}-${shedulesMaster[21]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[22]?.working === false && date.getTime() === new Date(`${shedulesMaster[22]?.date?.split('.')[2]}-${shedulesMaster[22]?.date?.split('.')[1]}-${shedulesMaster[22]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[23]?.working === false && date.getTime() === new Date(`${shedulesMaster[23]?.date?.split('.')[2]}-${shedulesMaster[23]?.date?.split('.')[1]}-${shedulesMaster[23]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[24]?.working === false && date.getTime() === new Date(`${shedulesMaster[24]?.date?.split('.')[2]}-${shedulesMaster[24]?.date?.split('.')[1]}-${shedulesMaster[24]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[25]?.working === false && date.getTime() === new Date(`${shedulesMaster[25]?.date?.split('.')[2]}-${shedulesMaster[25]?.date?.split('.')[1]}-${shedulesMaster[25]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[26]?.working === false && date.getTime() === new Date(`${shedulesMaster[26]?.date?.split('.')[2]}-${shedulesMaster[26]?.date?.split('.')[1]}-${shedulesMaster[26]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[27]?.working === false && date.getTime() === new Date(`${shedulesMaster[27]?.date?.split('.')[2]}-${shedulesMaster[27]?.date?.split('.')[1]}-${shedulesMaster[27]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[28]?.working === false && date.getTime() === new Date(`${shedulesMaster[28]?.date?.split('.')[2]}-${shedulesMaster[28]?.date?.split('.')[1]}-${shedulesMaster[28]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[29]?.working === false && date.getTime() === new Date(`${shedulesMaster[29]?.date?.split('.')[2]}-${shedulesMaster[29]?.date?.split('.')[1]}-${shedulesMaster[29]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[30]?.working === false && date.getTime() === new Date(`${shedulesMaster[30]?.date?.split('.')[2]}-${shedulesMaster[30]?.date?.split('.')[1]}-${shedulesMaster[30]?.date?.split('.')[0]}T00:00`).getTime()
        || shedulesMaster[31]?.working === false && date.getTime() === new Date(`${shedulesMaster[31]?.date?.split('.')[2]}-${shedulesMaster[31]?.date?.split('.')[1]}-${shedulesMaster[31]?.date?.split('.')[0]}T00:00`).getTime()
    }
      // !! dont look on top strings )))
    //   this is for test
      useEffect(() => {
        console.log(servicesData);
        console.log(userData);
        console.log(feedbackData);
      }, [servicesData, feedbackData])
    //   this is end for test
    return (
        <Spin className="spinner_loading"  size="large" spinning={isLoading || sendData}>
            {userData.landing_is_active ? 
             <div className="landing">
                <div className="landing_wrapper">
                    <div className="header"></div>
                    <div className="section">
                        <div className="section_main">
                            <div className="section_user">
                                <div style={{backgroundImage: `url(${userData.avatar})`}} className="user_img"></div>
                                <div className="user_name">{userData.first_name !== '' ? userData.first_name + " " + userData.last_name : "" }</div>
                                <Tooltip placement="right" title={userData.rating} className="user_raiting">
                                    <div style={{display: 'flex'}}>
                                        <Rate style={{color: '#F6BB62'}} disabled value={userData.rating} allowHalf/>
                                        <div className="user_raiting_number">{userData.rating + '.0'}</div>
                                    </div>
                                </Tooltip>
                                <div onClick={() => {
                                setFeedbackV(true)
                                }} className="btn_create_order">
                                    <span>????????????????????</span>
                                </div>
                            </div>
                            <div className="section_about_user">
                                <div class="about_user_left">
                                    <div className="about_user_title">?????? ??????</div>
                                    <div className="about_user_text">{userData.about ? userData.about : '???????????????? ??????????????????????'}</div>
                                </div>
                                <div className="about_user_right">
                                    <div className="reviews_title">???????????? <span onClick={()=> setModalV(true)} className="rewiews_title_img"></span></div>
                                    <div className="reviews_main">
                                        <div className="reviews_main_wrapper">
                                            {feedbackData ? feedbackData.map((elem)=> <div className="rewiews_user">
                                            <Avatar src="https://joeschmoe.io/api/v1/random" className="rewiews_user_img"/>
                                            <Tooltip placement="left" className="grade_wrapper">
                                                <Rate style={{color: '#F6BB62'}} className='grade' disabled value={elem.grade} allowHalf></Rate>
                                                <div className="rewiews_grade_raiting">{elem.grade + '.0'}</div>
                                            </Tooltip>
                                            <div className="rewiews_user_client">{elem.client}</div>
                                            <div className="rewiews_user_comment">{elem.comment}</div>
                                            <div className="rewiews_user_date">{elem.created}</div>
                                            </div>)   : "???????????? ?????????????? ????????"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="section_services">
                                <div className="services_title">????????????</div>
                                <div className="services_block">
                                    {servicesData.map((elem)=> <div onClick={() => {
                                    setSelectedService(elem.id)
                                    setFeedbackV(true)
                                    }} className="service">
                                        <div className="service_wrapper">
                                            <div style={{backgroundImage: `url(${elem.img})`}} className="service_img"></div>
                                            <div className="service_img_block_info">
                                                <div className="service_info_title">{elem.name}</div>
                                                <div className="service_info_text">{elem.description ? elem.description : '???????????????? ??????????????????????'}</div>
                                                <div className="service_info_group">
                                                    <div className="service_info_cost">??????????????????: {elem.cost} ???</div>
                                                    <div className="service_info_duration">????????????????????????: {elem.duration}</div>
                                                </div>
                                                <div className="service_info_btn">????????????????????</div>
                                            </div>
                                        </div>
                                        <div className="service_img_wrapper"></div>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal className={'modal-record'} footer={null} onCancel={() => {
                    setFeedbackV(false)
                    }} title="????????????" visible={feedbackV}>
                    <Form onFinish={sendRecord} className={'service-form'}>
                    <Input value={nameHolder} htmlType={'text'} onChange={((e) => {
                    setNameHolder(e.target.value)
                    })} required className={'form-input'} placeholder="??????"/>
                    <Input id={'phone-input'} value={phoneHolder} onChange={((e) => {
                    setPhoneHolder(e.target.value)
                    })} required placeholder={'?????????? ????????????????'} className={'form-input'} addonBefore={'+7'}/>
                    <select value={selectedService} required onChange={(e) => {
                    setTimeData('')
                    setSelectedService(e.target.value)
                    }}
                    className={'ant-input form-input email-select current'}>
                    <option selected disabled className={'pre-selected'} value={""}>????????????</option>
                    {servicesData.map(item => (
                    <option key={item.id} value={item.id}>{item.name + ' - ' + item.duration}</option>
                    ))}
                    </select>
                    <div className={'dates-block'}>
                    {selectedService && 
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>

                    <KeyboardDatePicker
                        onMonthChange={(month)=> changeMonth(month)}
                        format="dd/MM/yyyy"
                        label="???????????????? ?????????????? ????????"
                        value={selectedDate}
                        onChange={getCurrentDay}
                        shouldDisableDate={filterWeekends}
                        onClose={()=>closeDatePicker()}
                    />
                    
                    </MuiPickersUtilsProvider>
                    }
                    </div>
                    {notWorking &&
                    <Alert className={'form-input'} message="???????????? ???? ???????????????? ?? ???????? ????????" type="error"/>
                    }
                    {notSetService ? selectedService !== '' && 
                    <Alert className={'form-input'} type="error" message="????????????????????, ???????????????? ????????????" />
                    : <></>
                    }
                    {loadDate == null ? timeData.length > 0 &&
                    <div className={'time-block'}>
                    {timeData.map(item => (
                    <div onClick={() => {
                    setSelectedTime(item)
                    }} className={'time-item' + (selectedTime === item ? ' time-item__selected' : '')}
                    key={item} value={item}>{item}</div>
                    ))}
                    </div>
                    :  <Spin  size="large" spinning={loadDate}></Spin>
                    }
                    <TextArea onChange={((e) => {
                    setCommentHolder(e.target.value)
                    })} placeholder="??????????????????????" className={'form-input'} allowClear/>
                    <div><Switch required checked={recordCheck} onChange={(e) => {
                    setRecordCheck(e)
                    }} className={'form-switch'}/> ????????????????(-??) ???? ?????????????????? ???????????? *
                    </div>
                    <div className="form-buttons">
                    <Button className={"submit-button"} onClick={() => {
                    setFeedbackV(false)
                    }}>????????????</Button>
                    <Button
                    disabled={recordCheck === false || notWorking === true || nameHolder === '' || phoneHolder === '' || selectedService === null || selectedDate === null || selectedTime === null}
                    htmlType="submit">????????????????????</Button>

                    </div>
                    </Form>
                </Modal>
                <Modal footer={null} onCancel={() => {
                    setModalV(false)
                    }} title="???????????????? ??????????" visible={modalV}>
                    <Form onFinish={sendFeedback} className={'service-form'}>
                    <Input onChange={(e) => {
                    setNameFeedHolder(e.target.value)
                    }} htmlType={'text'} required className={'form-input'} placeholder="??????"/>
                    <Input  id={'phone-input'} onChange={(e) => {
                    setPhoneFeedHolder(e.target.value)
                    }} required placeholder={'?????????? ????????????????'} className={'form-input'} addonBefore={'+7'}/>
                    <Rate onChange={(e) => {
                    setGradeFeedHolder(e)
                    }} required className={'feedback-rating '}/>
                    <TextArea onChange={(e) => {
                    setCommentFeedHolder(e.target.value)
                    }} placeholder="??????????????????????" className={'form-input'} allowClear/>
                    <div><Switch value={checkFeedHolder} onChange={(e) => {
                    setCheckFeedHolder(e)
                    }} required defaultChecked className={'form-switch'}/> ????????????????(-??) ???? ?????????????????? ???????????? *
                    </div>
                    <div className="form-buttons">
                    <Button id={'cancel-button'} className={"submit-button form-button cancel-button"} onClick={() => {
                    setModalV(false)
                    }}>????????????</Button>
                    <Button className={"form-button"} disabled={checkFeedHolder === false || gradeFeedHolder === null || phoneFeedHolder === null}
                    htmlType="submit">??????????????</Button>

                    </div>
                    </Form>
                </Modal>
            </div>
            
            :  <div className="landing_not_active">
                    <div className="landing_wrapper">
                        <div className="header"></div>
                        <div className="section_not_active_wrapper">
                            <div className="section_not_active">
                                <div className="section_user">
                                    <div style={{backgroundImage: `url(${userData.avatar})`}} className="user_img"></div>
                                    <div className="user_name">{userData.length > 0 ? userData.first_name + " " + userData.last_name : "" }</div>
                                    <Tooltip placement="right" title={userData.rating} className="user_raiting">
                                        <div style={{display: 'flex'}}>
                                            {userData.length > 0 && <><Rate style={{color: '#F6BB62'}} disabled value={userData.rating} allowHalf/>
                                            <div className="user_raiting_number">{userData.rating + '.0'}</div></>
                                            }   
                                        </div>
                                    </Tooltip>
                                    <div className="user_not_active">???????????????????????? ???????????????? ?????????????????????? ?????????????????? ????????????</div>
                                </div>
                            </div>
                        </div>        
                    </div>    
                </div>        }
           
            <Modal style={{zIndex: '99999'}} closable={false} footer={null} visible={errorModal}>
                <Error></Error>
            </Modal>
            <Modal footer={null} onCancel={() => {
                setSuccessFeedModalV(false)
                }} title="??????????" visible={successFeedModalV}>
                <Result
                status="success"
                title="??????????"
                subTitle="?????? ?????????? ????????????????, ??????????????!"
                extra={[
                <Button onClick={() => {
                setSuccessFeedModalV(false)
                }} type="primary" key="console">
                ??????????????
                </Button>,

                ]}
                />
            </Modal>
            <Modal footer={null} onCancel={() => {
                setSuccessModalV(false)
                }} title="??????????" visible={successModalV}>
                <Result
                status="success"
                title="????????????"
                subTitle="???????? ???????????? ?????????????? ????????????????????????!"
                extra={[
                <Button onClick={() => {
                setSuccessModalV(false)
                }} type="primary" key="console">
                ??????????????
                </Button>,

                ]}
                />
            </Modal>
        </Spin>

    );
}

export default Main;




// !! old code

// !! 0

{/* <Content className={isLoading ? 'main-container loading' : 'main-container'}>
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
}} size={'large'} className={'service-button'}>????????????????????</Button>
<span className={'services-title'}>????????????</span>
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
<div className={'card-timeline'}>??????????????????????????????????: {item.duration}</div>
<div className={'card-price'}>????????: {item.cost} ??????.</div>
</Card>
))}


</div>
<div className={'feedback-title'}><span>????????????</span> <Button onClick={() => {
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
<Rate className={'grade'} disabled value={item.grade}></Rate>
</div>
</Tooltip>
</Comment>
))}
</Card>


<Modal className={'modal-record'} footer={null} onCancel={() => {
setFeedbackV(false)
}} title="????????????" visible={feedbackV}>
<Form onFinish={sendRecord} className={'service-form'}>
<Input value={nameHolder} htmlType={'text'} onChange={((e) => {
setNameHolder(e.target.value)
})} required className={'form-input'} placeholder="??????"/>
<Input id={'phone-input'} value={phoneHolder} onChange={((e) => {
setPhoneHolder(e.target.value)
})} required placeholder={'?????????? ????????????????'} className={'form-input'} addonBefore={'+7'}/>
<select value={selectedService} required onChange={(e) => {
setTimeData('')
setSelectedService(e.target.value)
}}
className={'ant-input form-input email-select current'}>
<option selected disabled className={'pre-selected'} value={""}>????????????</option>
{servicesData.map(item => (
<option key={item.id} value={item.id}>{item.name + ' - ' + item.duration}</option>
))}
</select>
<div className={'dates-block'}>
{selectedService && 
   <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>

   <KeyboardDatePicker
     onMonthChange={(month)=> changeMonth(month)}
     format="dd/MM/yyyy"
     label="???????????????? ?????????????? ????????"
     value={selectedDate}
     onChange={getCurrentDay}
     shouldDisableDate={filterWeekends}
     onClose={()=>closeDatePicker()}
   />
   
 </MuiPickersUtilsProvider>
}
</div>
{notWorking &&
<Alert className={'form-input'} message="???????????? ???? ???????????????? ?? ???????? ????????" type="error"/>
}
{notSetService ? selectedService !== '' && 
<Alert className={'form-input'} type="error" message="????????????????????, ???????????????? ????????????" />
: <></>
}
{loadDate == null ? timeData.length > 0 &&
<div className={'time-block'}>
{timeData.map(item => (
<div onClick={() => {
setSelectedTime(item)
}} className={'time-item' + (selectedTime === item ? ' time-item__selected' : '')}
key={item} value={item}>{item}</div>
))}
</div>
:  <Spin  size="large" spinning={loadDate}></Spin>
}
<TextArea onChange={((e) => {
setCommentHolder(e.target.value)
})} placeholder="??????????????????????" className={'form-input'} allowClear/>
<div><Switch required checked={recordCheck} onChange={(e) => {
setRecordCheck(e)
}} className={'form-switch'}/> ????????????????(-??) ???? ?????????????????? ???????????? *
</div>
<div className="form-buttons">
<Button className={"submit-button"} onClick={() => {
setFeedbackV(false)
}}>????????????</Button>
<Button
disabled={recordCheck === false || notWorking === true || nameHolder === '' || phoneHolder === '' || selectedService === null || selectedDate === null || selectedTime === null}
htmlType="submit">??????????????</Button>

</div>
</Form>
</Modal>


<Modal footer={null} onCancel={() => {
setModalV(false)
}} title="???????????????? ??????????" visible={modalV}>
<Form onFinish={sendFeedback} className={'service-form'}>
<Input onChange={(e) => {
setNameFeedHolder(e.target.value)
}} htmlType={'text'} required className={'form-input'} placeholder="??????"/>
<Input  id={'phone-input'} onChange={(e) => {
setPhoneFeedHolder(e.target.value)
}} required placeholder={'?????????? ????????????????'} className={'form-input'} addonBefore={'+7'}/>
<Rate onChange={(e) => {
setGradeFeedHolder(e)
}} required className={'feedback-rating '}/>
<TextArea onChange={(e) => {
setCommentFeedHolder(e.target.value)
}} placeholder="??????????????????????" className={'form-input'} allowClear/>
<div><Switch value={checkFeedHolder} onChange={(e) => {
setCheckFeedHolder(e)
}} required defaultChecked className={'form-switch'}/> ????????????????(-??) ???? ?????????????????? ???????????? *
</div>
<div className="form-buttons">
<Button id={'cancel-button'} className={"submit-button form-button cancel-button"} onClick={() => {
setModalV(false)
}}>????????????</Button>
<Button className={"form-button"} disabled={checkFeedHolder === false || gradeFeedHolder === null || phoneFeedHolder === null}
htmlType="submit">??????????????</Button>

</div>
</Form>
</Modal>


<Modal footer={null} onCancel={() => {
setSuccessModalV(false)
}} title="??????????" visible={successModalV}>
<Result
status="success"
title="????????????"
subTitle="???????? ???????????? ?????????????? ????????????????????????!"
extra={[
<Button onClick={() => {
setSuccessModalV(false)
}} type="primary" key="console">
??????????????
</Button>,

]}
/>
</Modal>

<Modal footer={null} onCancel={() => {
setSuccessFeedModalV(false)
}} title="??????????" visible={successFeedModalV}>
<Result
status="success"
title="??????????"
subTitle="?????? ?????????? ????????????????, ??????????????!"
extra={[
<Button onClick={() => {
setSuccessFeedModalV(false)
}} type="primary" key="console">
??????????????
</Button>,

]}
/>
</Modal>


<Modal closable={false} footer={null} visible={errorModal}>
<Error></Error>
</Modal>


</Content> */}

// !! 1

    // end this is array

    // useEffect(() => {
    //     if(yHolder == moment().year()){
    //         setArrayMHolder([])
    //         for(let i = 1; i< 13; i++){
    //             setArrayMHolder(arrayMHolder=> [...arrayMHolder, {value: i, title: i=='01' ? '????????????' : i=='02' ? '??????????????' :
    //             i == '03' ? '????????' : i == '04' ? '????????????' : i == '05' ? '??????' : i == '06' ? '????????' :
    //             i == '07' ? '????????' : i == '08' ? '????????????' : i == '09' ? '????????????????' : i == '10' ? '??????????????' :
    //             i == '11' ? '????????????' : '??????????????', active: (moment().month() >= i ? 1 : 0)}])
    //          }   
    //     } else{
    //         setArrayMHolder([])
    //         for(let i = 1; i< 13; i++){
    //             setArrayMHolder(arrayMHolder=> [...arrayMHolder, {value: i, title: i=='01' ? '????????????' : i=='02' ? '??????????????' :
    //             i == '03' ? '????????' : i == '04' ? '????????????' : i == '05' ? '??????' : i == '06' ? '????????' :
    //             i == '07' ? '????????' : i == '08' ? '????????????' : i == '09' ? '????????????????' : i == '10' ? '??????????????' :
    //             i == '11' ? '????????????' : '??????????????', active: 0}])
    //          }   
    //     }
    //     setMHolder("")
    // }, [yHolder])     

// !! 2
  {/* {selectedService && 
                    <>
                    <select required value={yHolder} className={'dates-item form-input'} onChange={(e) => {
                        setYHolder(e.target.value)
                    }} name="year">
                    <option selected disabled value="">????????</option>
                    {arrayHolder && arrayHolder.map(elem => <option key={elem} value={elem}>{elem}</option>)}
                    </select>
                    <select required value={mHolder} className={'dates-item email-select form-input'} onChange={(e) =>
                    getFreeDay(e.target.value)
                    } name="month">
                    <option selected disabled value="">??????????</option>
                    {arrayMHolder.length > 0 && arrayMHolder.map(elem=>
                        <option key={elem.value} value={elem.value} disabled={elem.active}
                        className={elem.active == 0 ? 'option_active' : 'option_disabled'}>{elem.title}</option>
                    )}
                    </select>
                    {mHolder ?
                    shedulesMaster?.length !== 0 ?
                    <select required value={dHolder} className={'dates-item email-select form-input'} onChange={(e) => {
                    setDHolder(e.target.value)
                    }} name="day">
                            <option disabled selected value="">????????</option>
                        {shedulesMaster && shedulesMaster.map(elem => 
                            <option key={elem.date} disabled={elem.working == false}
                            className={elem.working == false ? 'option_day_disabled' : 'option_day_active'} value={elem.date.split('.')[0]}>{elem.date.split('.')[0]}</option>
                            )}
                    </select>
                    :<select className={'dates-item email-select form-input'}>
                        <option disabled selected>?????????????? ??????</option></select>
                    : <></>
                    }
                    </>
            } */}

// !! 