import React, { useState } from 'react';
import ModuleTitle from '../components/ModuleTitle';
import PageTitle from '../components/PageTitle';
import Module from '../components/Module'

const Dashboard = (props) => {
    const { stacked, Modules, title, titleIcon, children, split } = props;
    return (
        <div className="dashboard">
            <div className='container-flex'>
                {props.title && <PageTitle icon={titleIcon}>{title}</PageTitle>}
                {!Modules &&
                    <div className="row mb-3">
                        {children}
                    </div>
                }
                {Modules &&
                    <div>
                        {stacked &&
                            <div>
                                {children.length > 0 && children.map((child,i) => {
                                    if (child.props) {
                                        return (
                                            <div className='row mb-3' key={i}>
                                                <Module title={child.props && child.props.title || undefined} {...child.props} icon={child.props.icon}>
                                                    {child}
                                                </Module>
                                            </div>

                                        )
                                    }
                                }
                                )}
                            </div>}
                        {!stacked &&
                            <div className="row">
                                <div className={split ? `col-lg-${split[0]} col-12` : 'col-lg-4 col-12'}>
                                    {children.length && children.filter(child => child.props && child.props.side === 'left').map((child,i) => {
                                        // console.log(child)
                                        return (
                                            <div className='mb-3' key={i}>
                                                <Module title={child.props && child.props.title || undefined} {...child.props} icon={child.props.icon}>
                                                    {child}
                                                </Module>
                                            </div>
                                        )
                                    }
                                    )}

                                </div>
                                <div className={split ? `col-lg-${split[1]}` : 'col-lg-8 col-12'}>
                                    {children.length && children.filter(child => child.props && child.props.side !== 'left').map((child,i) => {
                                        return (
                                            <div className='mb-3' key={i}>
                                                <Module title={child.props && child.props.title || undefined} {...child.props} icon={child.props.icon}>
                                                    {child}
                                                </Module>
                                            </div>
                                        )
                                    }
                                    )}
                                </div>
                            </div>}
                            {!children.length && 
                                <Module title={children.props && children.props.title || undefined} {...children.props}>
                                    {children}
                                </Module>
                            }
                    </div>
                }
            </div>
        </div>
    )
}
export default Dashboard