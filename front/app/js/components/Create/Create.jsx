import React from 'react';
import styles from './Create.css';

import Canvas from './Canvas/Canvas.jsx';
import Palette from './Palette/Palette.jsx';

import { patterns, exteriors, figures } from '../../../data/parts.json';

export default class Create extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 3,
            isDragging: false,
            proUser: false,
            lastStepSeen: 1,
            objects: {
                pattern: null,
                exterior: null,
                figures: []
            }
        };
    }

    getPaletteData(step) {
        let title;
        let data;
        let add;

        switch (step) {
            case 1:
                title = 'Chosse a pattern';
                data = patterns;
                add = this.setPattern;
                break;
            case 2:
                title = 'Choose an exterior';
                data = exteriors;
                add = this.setExterior;
                break;
            case 3:
                title = 'Drag figures to the canvas';
                data = figures;
                add = this.addFigure;
                break;
        }

        return { title, data, add };
    }

    canContinue(step) {
        if (step === 1 && this.state.objects.pattern) return true;
        if (step === 2 && this.state.objects.exterior) return true;
        if (step === 3 && this.state.objects.figures.length > 0) return true;
        return false;
    }

    setPattern({ src }) {
        this.setState({
            objects: {
                ...this.state.objects,
                pattern: src
            }
        });
    }

    setExterior({ src }) {
        this.setState({
            objects: {
                ...this.state.objects,
                exterior: src
            }
        });
    }

    addFigure(d) {
        this.setState({
            objects: {
                ...this.state.objects,
                figures: [...this.state.objects.figures, d]
            }
        });
    }

    updateFigure(index, payload) {
        const objects = this.state.objects;

        objects.figures[index] = {
            ...objects.figures[index],
            ...payload
        };

        this.setState({
            objects
        });
    }

    nextStep(e) {
        const newStep = this.state.step + 1;

        this.setState({
            step: newStep,
            lastStepSeen: Math.max(newStep, this.state.lastStepSeen)
        });
    }

    setDragStatus(status = false) {
        this.setState({
            ...this.state,
            isDragging: status
        });
    }

    render() {
        const { title, data, add } = this.getPaletteData(this.state.step);

        return (
            <div className={styles.create}>
                <Canvas
                    objects={this.state.objects}
                    add={add.bind(this)}
                    updateFigure={this.updateFigure.bind(this)}
                    isDragging={this.state.isDragging}
                />
                <Palette
                    title={title}
                    d={data}
                    setDragStatus={this.setDragStatus.bind(this)}
                    continue={this.canContinue(this.state.step)}
                    nextStep={this.nextStep.bind(this)}
                />
            </div>
        );
    }
}
