import React from "react";
import "./main_body.css"

class MainBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            button_class: '',
            block_class: 'right_',
        };
    }

    moveCenterBlock() {
        this.setState({block_class: ''});
    }

    moveRightBlock() {
        this.setState({block_class: 'right_'});
        setTimeout(() => this.moveCenterBlock(), 10);
    }

    moveLeftBlock() {
        this.setState({block_class: 'left_'});
        setTimeout(() => this.moveRightBlock(), 500);
    }

    moveLeftButton() {
        this.setState({button_class: 'left_'});
        setTimeout(() => {
            this.setState({button_class: 'hidden_'});
            setTimeout(() => this.moveCenterBlock(), 10);
        }, 500);
    }

    render() {
        let to_return;
        if (this.state.button_class != 'hidden_') {
            to_return = (
                <div className="wrapper">
                    <button className={this.state.button_class + "start_button"}
                            onClick={() => this.moveLeftButton()}>Старт!
                    </button>
                </div>
            )
        } else {
            to_return = (
                <div className="wrapper">
                    <div className={this.state.block_class + "block"}>
                        <div className={"variant"} onClick={() => this.moveLeftBlock()}/>
                        <div className={"variant"} onClick={() => this.moveLeftBlock()}/>
                    </div>
                </div>
            )
        }
        return to_return;
    }
}

export default MainBody;