import React, {FC} from 'react';
import {Figure} from "../Models/figures/Figure";

interface LostFiguresProps {
    title: string;
    figures: Figure[];
}

const LostFigures: FC<LostFiguresProps> = ({title,figures}) => {
    return (
        <div className="lost">
            <h3>{title}</h3>
            {figures.map(figure =>
            <div key={figure._id}>
                {figure._name} {figure._img && <img width={"20px"} height={"20px"} alt={figure._name} src={figure._img}/>}
            </div>
            )}
        </div>
    );
};

export default LostFigures;