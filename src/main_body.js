import React from "react";
import "./main_body.css"

class MainBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            button_class: '',
            block_class: 'right_',
            first_image_url: '',
            second_image_url: '',
            first_name: '',
            second_name: '',
            first_sub_count: 0,
            second_sub_count: 0
        };
    }

    moveCenterBlock() {
        this.setState({block_class: ''});
        fetch('/get/group')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({first_image_url: data.photo, first_name: data.name, first_sub_count: data.members_count});
            });
        fetch('/get/group')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({second_image_url: data.photo, second_name: data.name, second_sub_count: data.members_count});
            });
    }

    moveRightBlock() {
        this.setState({block_class: 'right_', first_name: '', second_name: ''});
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

    genFirstVariant() {
        let to_return = [];
        if (this.state.first_name == '') {
            to_return.push(
                <span>...</span>
            )
        } else {
            to_return.push(
                <div className="stripe"/>
            )
            to_return.push(
                <img className="variant_image" src={this.state.first_image_url} alt="first_image"/>
            )
            to_return.push(
                <span>{this.state.first_name}</span>
            )
        }
        return to_return;
    }

    genSecondVariant() {
        let to_return = [];
        if (this.state.second_name == '') {
            to_return.push(
                <span>...</span>
            )
        } else {
            to_return.push(
                <div className="stripe"/>
            )
            to_return.push(
                <img className="variant_image" src={this.state.second_image_url} alt="second_image"/>
            )
            to_return.push(
                <span>{this.state.second_name}</span>
            )
        }
        return to_return;
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
                        <div className={"variant"} onClick={() => this.moveLeftBlock()}>
                            {this.genFirstVariant()}
                        </div>
                        <div className={"variant"} onClick={() => this.moveLeftBlock()}>
                            {this.genSecondVariant()}
                        </div>
                    </div>
                </div>
            )
        }
        return to_return;
    }
}

export default MainBody;