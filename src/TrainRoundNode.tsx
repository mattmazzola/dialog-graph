import React from 'react'
import * as CLM from '@conversationlearner/models'
import * as RD3 from './reactd3types'

type Props = {
    node: RD3.INode<CLM.TrainRound>
}

const Component: React.FC<Props> = (node) => {
    return (
        <div>
            <h4>User Inputs:</h4>
            <ul>
                {node.node.data.extractorStep.textVariations.map(tv =>
                    <li>{tv.text}</li>
                )}
            </ul>

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