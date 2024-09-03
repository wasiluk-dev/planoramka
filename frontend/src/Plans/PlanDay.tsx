import React, { useState } from "react";

// Define the kierunki object
const kierunki: { [key: number]: { [key: number]: string } } = {
    1: {
        1: 'K1_1',
        2: 'K1_2',
        3: 'K1_3'
    },
    2: {
        1: 'K2_1',
        2: 'K2_2',
        3: 'K2_3'
    },
    3: {
        1: 'K3_1',
        2: 'K3_2',
        3: 'K3_3'
    }
};

const PlanDay: React.FC = () => {
    // State to hold the selected department (wydział) and the selected kierunek
    const [selectedWydzial, setSelectedWydzial] = useState<string>("");
    const [selectedKierunek, setSelectedKierunek] = useState<string>("");

    // Function to handle selection change for department
    const handleWydzialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWydzial(event.target.value);
        setSelectedKierunek(""); // Reset kierunek when wydział changes
    };

    // Function to handle selection change for kierunek
    const handleKierunekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedKierunek(event.target.value);
    };

    // Get the kierunki options based on selectedWydzial
    const kierunkiOptions = selectedWydzial ? Object.entries(kierunki[parseInt(selectedWydzial)]) : [];

    return (
        <div className="bg-secondary col-2">
            <select
                className="form-select"
                aria-label="Default select example"
                value={selectedWydzial}
                onChange={handleWydzialChange} // handle department change
            >
                <option value="" disabled hidden>Wybierz wydział</option>
                <option value="1">Wydział 1</option>
                <option value="2">Wydział 2</option>
                <option value="3">Wydział 3</option>
            </select>

            {/* Render the kierunki dropdown only if a department is selected */}
            {selectedWydzial && (
                <div className="mt-2">
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedKierunek}
                        onChange={handleKierunekChange} // handle kierunek change
                    >
                        <option value="" disabled hidden>Wybierz kierunek</option>
                        {kierunkiOptions.map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedKierunek && (
                <div className="mt-2">
                    <p>Wybrano: Wydział {selectedWydzial}, Kierunek {kierunki[selectedWydzial][selectedKierunek]}</p>
                </div>
            )}
        </div>
    );
};

export default PlanDay;
