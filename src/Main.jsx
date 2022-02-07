import api from "./plugins/axios/api";
import './Main.css'
import {Content} from "antd/es/layout/layout";
import Avatar from "antd/es/avatar/avatar";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {Button, Card, Comment, Input, Rate, Switch, Tooltip} from "antd";
import "antd/dist/antd.css";
import Meta from "antd/es/card/Meta";
import Modal from "antd/es/modal/Modal";

function Main() {
    const { TextArea } = Input;
    const params = useParams();
    let [userData, setUserData] = useState([])
    let [servicesData, setServicesData] = useState([])
    let [feedbackData, setFeedbackData] = useState([])
    let [feedbackV, setFeedbackV] = useState(false)


    useEffect(()=>{
        api(`portfolio/user_landing/master/?mst=${params.id}`)
            .then((response)=>{
                setUserData(response.data[0])
                console.log(userData)
            })
        api(`portfolio/user_landing/services/?mst=${params.id}`)
            .then((response)=>{
                setServicesData(response.data)
            })
        api(`portfolio/user_landing/grades/?mst=${params.id}`)
            .then((response)=>{
                setFeedbackData(response.data)
                console.log(feedbackData)
            })
    },[])
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
                <span className={'feedback-title'}>Отзывы</span>

                <Card className={'feedback-list'}>
                    {feedbackData.map(item => (
                    <Comment
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
                <Modal title="Запись" visible={feedbackV} onOk={()=>{setFeedbackV(true)}} onCancel={()=>{setFeedbackV(false)}}>
                    <Input className={'form-input'} placeholder="Имя" />
                    <Input placeholder={'Номер телефона'} className={'form-input'} addonBefore={'+7'}  />
                    <TextArea placeholder={"Комментарий"} className={'form-input'} rows={4}></TextArea>
                    <Switch defaultChecked  className={'form-switch'}   /> Согласен(-а) на обработку данных *
                </Modal>
            </Content>


    );
}

export default Main;
