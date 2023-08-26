/* eslint-disable no-unused-vars */
import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'
import state from '../store'


const ColorPicker = () => {
   const snap = useSnapshot(state)
   return (
      <div className=' absolute left-full ml-3'>
         <SketchPicker
            presetColors={[
               '#000000',
               '#ffffff',
               '#ff0000',
               '#00ff00',
               '#ffff00',
               '#0000ff',
               '#00ffff',
               '#ff00ff',
               '#EFBD4E',
               '#80C670',
               '#726DE8',
               '#ff8a65',
               '#7098DA',
               '#C19277',
               '#EF96AD',
               '#512314',
               '#5F123D'
            ]}
            color={snap.color}
            disableAlpha
            onChange={(color) => state.color = color.hex}
         />
      </div>
   )
}

export default ColorPicker
