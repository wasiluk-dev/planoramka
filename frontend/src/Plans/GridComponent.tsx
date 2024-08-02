import React from 'react';

interface GridComponentProps {
    rows: number;
}

const GridComponent: React.FC<GridComponentProps> = ({ rows }) => {
    const totalItems = rows * 9;
    const items = Array.from({ length: totalItems }, (_, index) => index + 1);

    return (
        <>
            {items.map(item => (
                <div key={item} className="grid-item">
                    {item}
                </div>
            ))}
        </>
    );
};

export default GridComponent;
