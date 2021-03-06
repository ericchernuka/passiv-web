import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import { baseUrl, importTarget, loadGroups } from '../actions';
import { selectCurrentGroupId, selectCurrentGroupTarget } from '../selectors';
import TargetBar from './TargetBar';
import CashBar from './CashBar';
import { Button } from '../styled/Button';
import { patchData, postData } from '../api';

import ShadowBox from '../styled/ShadowBox';

export class AccountTargets extends React.Component {
  state = { edit: false }

  setSymbol(target, symbol) {
    target.fullSymbol = symbol;
    target.symbol = symbol.id;
    this.forceUpdate();
  }

  render() {
    const { target, groupId, startImportTarget } = this.props;
    const { edit } = this.state;

    // show a spinner if we don't have our data yet
    if (!target) {
      return (
        <ShadowBox>
          <h3>Target Portfolio</h3>
          <span><FontAwesomeIcon icon={faSpinner} spin /></span>
        </ShadowBox>
      );
    }

    // help them set a target if they don't have one yet
    if (target && target.length === 0) {
      return (
        <ShadowBox>
          <h3>Target Portfolio</h3>
          <span>No target set<button onClick={() => startImportTarget(groupId)}>Import</button></span>
        </ShadowBox>
      );
    }

    return (
      <ShadowBox>
        <h3>Target Portfolio</h3>
        <Formik
          initialValues={{ targets: target }}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            // post the new targets and update our data
            values.targets.forEach(target => {
              if (target.id) {
                // update if it's an existing target
                patchData(`${baseUrl}/api/v1/portfolioGroups/${groupId}/targets/${target.id}`, target)
                .then(response => {
                  this.setState({edit: false});
                  this.props.refreshGroups();
                })
                .catch(error => {
                  this.setState({edit: false});
                });
              } else {
                // add if it's a new target
                postData(`${baseUrl}/api/v1/portfolioGroups/${groupId}/targets/`, target)
                .then(response => {
                  this.setState({edit: false});
                  this.props.refreshGroups();
                })
                .catch(error => {
                  this.setState({edit: false});
                });
              }
            });
          }}
          onReset={(values, actions) => {
            this.setState({ edit: false });
          }}
          render={(props) => (
            <Form>
              <div className="flex w-full">
                <div className="w-1/6 text-xl">
                  Symbol
                </div>
                <div className="w-1/2 text-xl">
                  &nbsp;
                </div>
                <div className="flex w-1/3">
                  <div className="w-1/3 text-xl">
                    Target
                  </div>
                  <div className="w-1/3 text-xl">
                    Actual
                  </div>
                  <div className="w-1/3 text-xl">
                    Delta
                  </div>
                </div>
              </div>
              <FieldArray
                name="targets"
                render={arrayHelpers => {
                  const cashPercentage = 100 - props.values.targets.reduce((total, target) => {
                    if (target.percent) {
                      return total + parseFloat(target.percent);
                    }
                    return total;
                  }, 0);
                  const cashActualPercentage = 100 - props.values.targets.reduce((total, target) => {
                    if (target.actualPercentage) {
                      return total + target.actualPercentage;
                    }
                    return total;
                  }, 0);
                  return (
                  <React.Fragment>
                    {props.values.targets.map((t, index) => (
                      <TargetBar
                        key={t.symbol}
                        target={t}
                        edit={edit}
                        setSymbol={(symbol) => this.setSymbol(t, symbol)}
                      >
                        <Field name={`targets.${index}.percent`} className="w-1/2" readOnly={!this.state.edit} />
                      </TargetBar>
                    ))}
                    <CashBar percentage={cashPercentage} actualPercentage={cashActualPercentage} />
                    <ErrorMessage name="targets" />
                    {edit ? (
                      <React.Fragment>
                        <Button type="button" onClick={() => arrayHelpers.push({ symbol: null, percent: 0 })}>
                          Add
                        </Button>
                        <Button type="button">
                          Import
                        </Button>
                        {
                          cashPercentage < 0 ? (
                            <Button type="submit" onClick={props.handleSubmit} disabled={true}>
                              Save
                            </Button>
                          ) : (
                            <Button type="submit" onClick={props.handleSubmit} disabled={!props.dirty}>
                              Save
                            </Button>
                          )
                        }
                        <Button type="button" onClick={props.handleReset}>
                          Cancel
                        </Button>
                      </React.Fragment>
                    ) : (
                      <Button type="button" onClick={() => this.setState({ edit: true })}>
                        Edit
                      </Button>
                      )}
                  </React.Fragment>
                )}}
              />
            </Form>
          )}
        />
      </ShadowBox>
    );
  }
}

const actions = {
  startImportTarget: importTarget,
  refreshGroups: loadGroups,
};

const select = state => ({
  groupId: selectCurrentGroupId(state),
  target: selectCurrentGroupTarget(state)
});

export default connect(select, actions)(AccountTargets);
