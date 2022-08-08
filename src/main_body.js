import React from "react";
import "./main_body.css"

class MainBody extends React.Component {
    start_state = {
        button_class: 'center',
        label_class: 'center',
        block_class: 'right',
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

    constructor(props) {
        super(props);
        this.state = this.start_state;
    }

    componentDidMount() {
        if (localStorage.getItem('max_score')) {
            this.setState({max_score: Number(localStorage.getItem('max_score'))});
        } else {
            this.setState({max_score: 0});
        }
    }

    setStateFirst(obj, photo, name, members_count) {
        obj.setState({first_image_url: photo, first_name: name, first_sub_count: members_count});
    }

    setStateSecond(obj, photo, name, members_count) {
        obj.setState({second_image_url: photo, second_name: name, second_sub_count: members_count});
    }

    makeRequest(obj, func) {
        fetch('server/get/group')
            .then(response => response.json())
            .then(data => {
                let name = data.name;
                if (name.length > 25) {
                    name = name.slice(0, 22) + '...';
                }
                func(obj, data.photo, name, data.members_count)
            });
    }

    moveCenterBlock() {
        this.setState({block_class: 'center'});
        this.makeRequest(this, this.setStateFirst);
        this.makeRequest(this, this.setStateSecond);
    }

    moveRightBlock() {
        this.setState({block_class: 'right', first_name: '', second_name: '', members_visibility: false, clicked_first: false});
        setTimeout(() => this.moveCenterBlock(), 10);
    }

    moveLeftBlock(need_next) {
        this.setState({block_class: 'left'});
        if (need_next) {
            setTimeout(() => this.moveRightBlock(), 500);
        }
    }

    moveCenterButton() {
        this.setState({button_class: 'center', label_class: 'center', max_score_span_class: ''});
    }

    moveLeftButton() {
        this.setState({button_class: 'left', label_class: 'right', max_score_span_class: 'transparent_'});
        setTimeout(() => {
            this.setState({button_class: 'hidden', label_class: 'hidden'});
            setTimeout(() => this.moveCenterBlock(), 10);
        }, 500);
    }

    clickOnVariant(is_right) {
        if (this.state.members_visibility || this.state.first_name === '' || this.state.second_name === '') {
            return;
        }
        if ((!is_right && this.state.first_sub_count < this.state.second_sub_count) || (is_right && this.state.second_sub_count < this.state.first_sub_count)) {
            localStorage.setItem('max_score', Math.max(this.state.max_score, this.state.now_score).toString());
            this.setState({members_visibility: true, need_restart: true, clicked_first: !is_right, max_score: Math.max(this.state.max_score, this.state.now_score)});
        } else {
            this.setState({members_visibility: true, need_restart: false, clicked_first: !is_right, now_score: this.state.now_score + 1});
        }
    }

    genVariantInside(name, image_url, sub_count) {
        let to_return = [];
        if (name === '') {
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
                <img className="variant_image" src={image_url} alt="first_image"/>
            )
            to_return.push(
                <span>{name}</span>
            )
            if (this.state.members_visibility) {
                to_return.push(
                    <span>{"Подписчики: " + sub_count.toString()}</span>
                )
            }
        }
        return to_return;
    }

    genVariant(name, image_url, sub_count, is_right, is_good, is_clicked) {
        let to_return = [];
        if (!this.state.members_visibility || !is_clicked) {
            to_return.push(
                <div className="variant" onClick={() => this.clickOnVariant(is_right)}>
                    {this.genVariantInside(name, image_url, sub_count)}
                </div>
            );
        } else {
            if (is_good) {
                to_return.push(
                    <div className="variant" quality="good" onClick={() => this.clickOnVariant(is_right)}>
                        {this.genVariantInside(name, image_url, sub_count)}
                    </div>
                );
            } else {
                to_return.push(
                    <div className="variant" quality="bad" onClick={() => this.clickOnVariant(is_right)}>
                        {this.genVariantInside(name, image_url, sub_count)}
                    </div>
                );
            }
        }
        return to_return;
    }

    restart() {
        this.moveLeftBlock(false);
        setTimeout(() => {
            this.setState(this.start_state);
            this.setState({
                button_class: 'right',
                label_class: 'left',
                block_class: 'right',
                max_score_span_class: 'transparent'
            });
            setTimeout(() => this.moveCenterButton(), 10);
        }, 500);
    }

    genButton() {
        if (this.state.members_visibility) {
            if (this.state.need_restart) {
                return (
                    <button className="next_button" onClick={() => this.restart()}>Заново</button>
                )
            } else {
                return (
                    <button className="next_button" onClick={() => this.moveLeftBlock(true)}>Далее</button>
                )
            }
        } else {
            return (
                <button className="hidden_next_button" onClick={() => this.moveLeftBlock(true)}>Далее</button>
            )
        }
    }

    render() {
        let to_return;
        if (this.state.button_class !== 'hidden') {
            to_return = (
                <div className="wrapper">
                    <div className="label" position={this.state.label_class.toString()}>
                        <h1>VK GROUP GAME</h1>
                    </div>
                    <span className={this.state.max_score_span_class.toString() + "max_score_span"}>Максимальный счёт: {this.state.max_score}</span>
                    <div className="block" position={this.state.button_class.toString()}>
                        <button onClick={() => this.moveLeftButton()}>Старт!</button>
                    </div>
                </div>
            )
        } else {
            to_return = (
                <div className="wrapper">
                    <div className="block" position={this.state.block_class.toString()}>
                        <h1>У кого больше подписчиков?</h1>
                        <span className="score_span">Текущий счёт: {this.state.now_score}</span>
                        <div className="variant_block">
                            {this.genVariant(this.state.first_name, this.state.first_image_url, this.state.first_sub_count, false, this.state.first_sub_count >= this.state.second_sub_count, this.state.clicked_first)}
                            {this.genVariant(this.state.second_name, this.state.second_image_url, this.state.second_sub_count, true, this.state.second_sub_count >= this.state.first_sub_count, !this.state.clicked_first)}
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