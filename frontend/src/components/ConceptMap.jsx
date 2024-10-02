import React from 'react';

const ConceptMap = ({ conceptMapImage }) => {
    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Concept Map</h3>
            <img src={`data:image/png;base64,${conceptMapImage}`} alt="Concept Map" className="w-full" />
        </div>
    );
};

export default ConceptMap;