import React from 'react';

const RelevantPhrases = ({ phrases }) => {
    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Relevant Phrases</h3>
            <ul className="list-disc pl-5">
                {phrases.map((phrase, index) => (
                    <li key={index} className="mb-1">{phrase}</li>
                ))}
            </ul>
        </div>
    );
};

export default RelevantPhrases;