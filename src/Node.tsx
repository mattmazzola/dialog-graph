import React from 'react'

const Component: React.FC<{ person: any }> = ({ person }) => {
    const isMale = person.data.gender === "male"

    return (
        <div className={`person-node ${isMale ? "male" : "female"}`}>
            <div className="name">{person.data.name}</div>

            <div>
                <div>
                    <p>row 1</p>
                    <p>row 2</p>
                </div>

                <div>
                    <div>Bike</div>
                    <div>Car</div>
                </div>
            </div>
        </div>
    )
}

export default Component