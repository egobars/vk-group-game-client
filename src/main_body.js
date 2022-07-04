import React from "react";
import "./main_body.css"

class MainBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            button_class: '',
            label_class: '',
            block_class: 'right_',
            first_image_url: '',
            second_image_url: '',
            first_name: '',
            second_name: '',
            first_sub_count: 0,
            second_sub_count: 0,
            members_visibility: false,
            need_restart: false,
            clicked_first: false,
            now_score: 0,
            max_score_span_class: ''
        };
    }

    componentDidMount() {
        if (localStorage.getItem('max_score')) {
            this.setState({max_score: Number(localStorage.getItem('max_score'))});
        } else {
            this.setState({max_score: 0});
        }
    }

    moveCenterBlock() {
        this.setState({block_class: ''});
        fetch('/get/group')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let name = data.name;
                if (name.length > 25) {
                    name = name.slice(0, 22) + '...';
                }
                this.setState({first_image_url: data.photo, first_name: name, first_sub_count: data.members_count});
            });
        fetch('/get/group')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let name = data.name;
                if (name.length > 22) {
                    name = name.slice(0, 19) + '...';
                }
                this.setState({second_image_url: data.photo, second_name: name, second_sub_count: data.members_count});
            });
    }

    moveRightBlock() {
        this.setState({block_class: 'right_', first_name: '', second_name: '', members_visibility: false, clicked_first: false});
        setTimeout(() => this.moveCenterBlock(), 10);
    }

    moveLeftBlock(need_next) {
        this.setState({block_class: 'left_'});
        if (need_next) {
            setTimeout(() => this.moveRightBlock(), 500);
        }
    }

    moveCenterButton() {
        this.setState({button_class: '', label_class: '', max_score_span_class: ''});
    }

    moveLeftButton() {
        this.setState({button_class: 'left_', label_class: 'right_', max_score_span_class: 'transparent_'});
        setTimeout(() => {
            this.setState({button_class: 'hidden_', label_class: 'hidden_'});
            setTimeout(() => this.moveCenterBlock(), 10);
        }, 500);
    }

    clickOnVariant(is_right) {
        if (this.state.members_visibility) {
            return;
        }
        if ((!is_right && this.state.first_sub_count < this.state.second_sub_count) || (is_right && this.state.second_sub_count < this.state.first_sub_count)) {
            localStorage.setItem('max_score', Math.max(this.state.max_score, this.state.now_score).toString());
            this.setState({members_visibility: true, need_restart: true, clicked_first: !is_right, max_score: Math.max(this.state.max_score, this.state.now_score)});
        } else {
            this.setState({members_visibility: true, need_restart: false, clicked_first: !is_right, now_score: this.state.now_score + 1});
        }
    }

    genFirstVariantInside() {
        let to_return = [];
        if (this.state.first_name == '') {
            to_return.push(
                <div className="loader_wrapper">
                    <div className="loader" />
                </div>
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
            if (this.state.members_visibility) {
                to_return.push(
                    <span>{"Подписчики: " + this.state.first_sub_count.toString()}</span>
                )
            }
        }
        return to_return;
    }

    genFirstVariant() {
        let to_return = [];
        if (!this.state.members_visibility || !this.state.clicked_first) {
            to_return.push(
                <div className={"variant"} onClick={() => this.clickOnVariant(false)}>
                    {this.genFirstVariantInside()}
                </div>
            );
        } else {
            if (this.state.first_sub_count >= this.state.second_sub_count) {
                to_return.push(
                    <div className={"good_variant"} onClick={() => this.clickOnVariant(false)}>
                        {this.genFirstVariantInside()}
                    </div>
                );
            } else {
                to_return.push(
                    <div className={"bad_variant"} onClick={() => this.clickOnVariant(false)}>
                        {this.genFirstVariantInside()}
                    </div>
                );
            }
        }
        return to_return;
    }

    genSecondVariantInside() {
        let to_return = [];
        if (this.state.second_name == '') {
            to_return.push(
                <div className="loader_wrapper">
                    <div className="loader" />
                </div>
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
            if (this.state.members_visibility) {
                to_return.push(
                    <span>{"Подписчики: " + this.state.second_sub_count.toString()}</span>
                )
            }
        }
        return to_return;
    }

    genSecondVariant() {
        let to_return = [];
        if (!this.state.members_visibility || this.state.clicked_first) {
            to_return.push(
                <div className={"variant"} onClick={() => this.clickOnVariant(true)}>
                    {this.genSecondVariantInside()}
                </div>
            );
        } else {
            if (this.state.first_sub_count <= this.state.second_sub_count) {
                to_return.push(
                    <div className={"good_variant"} onClick={() => this.clickOnVariant(true)}>
                        {this.genSecondVariantInside()}
                    </div>
                );
            } else {
                to_return.push(
                    <div className={"bad_variant"} onClick={() => this.clickOnVariant(true)}>
                        {this.genSecondVariantInside()}
                    </div>
                );
            }
        }
        return to_return;
    }

    restart() {
        this.moveLeftBlock(false);
        setTimeout(() => {
            this.setState({
                button_class: 'right_',
                label_class: 'left_',
                block_class: 'right_',
                first_image_url: '',
                second_image_url: '',
                first_name: '',
                second_name: '',
                first_sub_count: 0,
                second_sub_count: 0,
                members_visibility: false,
                need_restart: false,
                clicked_first: false,
                now_score: 0,
            });
            setTimeout(() => this.moveCenterButton(), 10);
        }, 500);
    }

    genButton() {
        let to_return = [];
        if (this.state.members_visibility) {
            if (this.state.need_restart) {
                to_return.push(
                    <button className="next_button" onClick={() => this.restart()}>Заново</button>
                )
            } else {
                to_return.push(
                    <button className="next_button" onClick={() => this.moveLeftBlock(true)}>Далее</button>
                )
            }
        } else {
            to_return.push(
                <button className="hidden_next_button" onClick={() => this.moveLeftBlock(true)}>Далее</button>
            )
        }
        return to_return;
    }

    render() {
        let to_return;
        if (this.state.button_class != 'hidden_') {
            to_return = (
                <div className="wrapper">
                    <div className={this.state.label_class + "label"}>
                        <h1>VK GROUP GAME</h1>
                    </div>
                    <span className={this.state.max_score_span_class.toString() + "max_score_span"}>Максимальный счёт: {this.state.max_score}</span>
                    <div className={this.state.button_class + "block"}>
                        <button onClick={() => this.moveLeftButton()}>Старт!</button>
                    </div>
                </div>
            )
        } else {
            to_return = (
                <div className="wrapper">
                    <div className={this.state.block_class + "block"}>
                        <h1>У кого больше подписчиков?</h1>
                        <span className="score_span">Текущий счёт: {this.state.now_score}</span>
                        <div className="variant_block">
                            {this.genFirstVariant()}
                            {this.genSecondVariant()}
                        </div>
                        {this.genButton()}
                    </div>
                </div>
            )
        }
        return to_return;
    }
}

export default MainBody;