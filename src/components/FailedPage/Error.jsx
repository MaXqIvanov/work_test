import {Button, Result} from "antd";


function Error() {
    return (
        <div className="Error">
            <Result
                status="404"
                title="404"
                subTitle="Такой страницы не существует."
            />
        </div>
    );
}

export default Error;
