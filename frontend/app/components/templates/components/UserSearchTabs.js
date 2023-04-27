import React , {useState} from 'react'
import label from '../../../../assets/i18n/en.json'
import Tab from './Tab'

export default function UserSearchTabs(props) {

      const [activeTab,setActiveTab] =useState(props.children[0].props.label)
      // const{onClickTabItem,children} = props
      const {children} = props

      const onClickTabItem = (tab) => {
         setActiveTab(tab);
       }

     return (
       <>
         <div className='tiny ui secondary menu' >
            <ol className='item'>
               {children.map((child) => {
                  const { label } = child.props;

                  return (
                  <Tab
                     activeTab={activeTab}
                     key={label}
                     label={label}
                     onClick={onClickTabItem}
                  />
                  );
               })}
            </ol>
           
         </div>
         <div>
               {children.map((child) => {
                  if (child.props.label !== activeTab) return undefined;
                  return child.props.children;
               })}
            </div>
       </>
    )
}