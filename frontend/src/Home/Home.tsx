import React from "react";
const Home: React.FC = () => {
    return (
        <>
            Witaj!
            <div style={{position: "relative", width: "100%", height: "200px"}}>
                {/* First Table (bottom layer) */}
                <table
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        border: "1px solid black",
                        zIndex: 1,
                    }}
                >
                    <thead>
                    <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        <th>Column 3</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Data 1-1</td>
                        <td>Data 1-2</td>
                        <td>Data 1-3</td>
                    </tr>
                    </tbody>
                </table>

                {/* Second Table (middle layer) */}
                <table
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        width: "100%",
                        border: "1px solid blue",
                        zIndex: 2,
                    }}
                >
                    <thead>
                    <tr>
                        <th>Column A</th>
                        <th>Column B</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Data A1</td>
                        <td>Data B1</td>
                    </tr>
                    </tbody>
                </table>

                {/* Third Table (top layer) */}
                <table
                    style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        width: "100%",
                        border: "1px solid green",
                        zIndex: 3,
                    }}
                >
                    <thead>
                    <tr>
                        <th>Header X</th>
                        <th>Header Y</th>
                        <th>Header Z</th>
                        <th>Header W</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Data X1</td>
                        <td>Data Y1</td>
                        <td>Data Z1</td>
                        <td>Data W1</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Home;
