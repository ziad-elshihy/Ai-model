/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
   const snap = useSnapshot(state);

   const [file, setFile] = useState('');

   const [prompt, setPrompt] = useState('');
   const [generatingImg, setGeneratingImg] = useState(false);
   const [isActive, setIsActive] = useState(false);
   const [activeEditorTab, setActiveEditorTab] = useState("");
   const [activeFilterTab, setActiveFilterTab] = useState({
      logoShirt: true,
      stylishShirt: false,
   })

   // show tab content when click on the activeTab
   const generateTabContent = () => {
      switch (activeEditorTab) {
         case "colorpicker":
            return <ColorPicker />
         case "filepicker":
            return <FilePicker
               file={file}
               setFile={setFile}
               readFile={readFile}
            />
         default:
            return null;
      }
   }


   const handleDecals = (type, result) => {
      const decalType = DecalTypes[type];

      state[decalType.stateProperty] = result;

      if (!activeFilterTab[decalType.filterTab]) {
         handleActiveFilterTab(decalType.filterTab)
      }
   }

   const handleActiveFilterTab = (tabName) => {
      switch (tabName) {
         case "logoShirt":
            state.isLogoTexture = !activeFilterTab[tabName];
            break;
         case "stylishShirt":
            state.isFullTexture = !activeFilterTab[tabName];
            break;
         default:
            state.isLogoTexture = true;
            state.isFullTexture = false;
            break;
      }

      // after setting the state, activeFilterTab is updated

      setActiveFilterTab((prevState) => {
         return {
            ...prevState,
            [tabName]: !prevState[tabName]
         }
      })
   }

   const readFile = (type) => {
      reader(file)
         .then((result) => {
            handleDecals(type, result);
            setActiveEditorTab("");
         })
   }
   const generateStyle = () => {
      return {
         backgroundColor: snap.color,
      }
   }
   return (
      <AnimatePresence>
         {!snap.intro && (
            <>
               <motion.div
                  key="custom"
                  className="absolute top-0 left-0 z-10"
                  {...fadeAnimation}
               >
                  <div className="flex items-center min-h-screen">
                     <button
                        style={generateStyle()}
                        className={isActive
                           ? "fixed top-5 left-5 text-white bg-black flex-1 rounded-md w-fit px-4 py-2.5 font-bold text-sm"
                           : `fixed left-5 flex-1 rounded-md w-fit px-4 py-2.5 font-bold text-sm text-white bg-${state.color}`
                        }
                        onClick={() => setIsActive(!isActive)}
                     >
                        {isActive ? "Close Editor" : "Start Editor"}
                     </button>
                     {
                        isActive && (
                           <div className="editortabs-container tabs">
                              {EditorTabs.map((tab) => (
                                 <Tab
                                    key={tab.name}
                                    tab={tab}
                                    handleClick={() => setActiveEditorTab(tab.name)}
                                 />
                              ))}
                              {generateTabContent()}
                           </div>
                        )}
                  </div>
               </motion.div>

               <motion.div
                  className="absolute z-10 top-5 right-5"
                  {...slideAnimation('right')}
               >
                  <CustomButton
                     type="filled"
                     title="Go Back"
                     handleClick={() => state.intro = true}
                     customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                  />
               </motion.div>

               <motion.div
                  className='filtertabs-container'
                  {...slideAnimation("up")}
               >
                  {FilterTabs.map((tab) => (
                     <Tab
                        key={tab.name}
                        tab={tab}
                        isFilterTab
                        isActiveTab={activeFilterTab[tab.name]}
                        handleClick={() => handleActiveFilterTab(tab.name)}
                     />
                  ))}
               </motion.div>
            </>
         )}
      </AnimatePresence>
   )
}

export default Customizer