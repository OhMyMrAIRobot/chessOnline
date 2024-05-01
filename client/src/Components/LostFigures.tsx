import React, {FC} from 'react';
import {Figure} from "../Models/figures/Figure";

interface LostFiguresProps {
    figures: Figure[];
}

const LostFigures: FC<LostFiguresProps> = ({figures}) => {
    return (
        <div className="lost">
            {figures.map(figure =>
            <div key={figure._id}>
                {figure._img && <img className={"lostFigure"} alt={figure._name} src={figure._img}/>}
            </div>
            )}
        </div>
    );
};

export default LostFigures;