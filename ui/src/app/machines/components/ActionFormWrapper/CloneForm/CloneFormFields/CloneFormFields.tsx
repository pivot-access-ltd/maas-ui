import { useEffect, useState } from "react";

import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import type { CloneFormValues } from "../CloneForm";

import SourceMachineSelect from "./SourceMachineSelect";

import FormikField from "app/base/components/FormikField";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

export const CloneFormFields = (): JSX.Element => {
  const [selectedMachine, setSelectedMachine] = useState<MachineDetails | null>(
    null
  );
  const { setFieldValue, values } = useFormikContext<CloneFormValues>();
  const dispatch = useDispatch();
  const machineInState = useSelector((state: RootState) =>
    machineSelectors.getById(state, values.source)
  );
  const unselectedMachines = useSelector(machineSelectors.unselected);
  const loadingMachines = !useSelector(machineSelectors.loaded);
  const loadingDetails = !!values.source && !selectedMachine;

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

  // The machine in state can change between types Machine and MachineDetails at
  // any time if it's not the "active" machine, so we set the MachineDetails
  // version in local state when it's available. This would not be necessary
  // if it were possible to set more than one machine as "active" at a time.
  // https://bugs.launchpad.net/maas/+bug/1939078
  useEffect(() => {
    if (!selectedMachine && isMachineDetails(machineInState)) {
      setSelectedMachine(machineInState);
    }
  }, [machineInState, selectedMachine]);

  return (
    <Row>
      <Col size={4}>
        <p>1. Select the source machine</p>
        <SourceMachineSelect
          loadingDetails={loadingDetails}
          loadingMachines={loadingMachines}
          machines={unselectedMachines}
          onMachineClick={(machine) => {
            if (machine) {
              setFieldValue("source", machine.system_id);
              dispatch(machineActions.get(machine.system_id));
            } else {
              setFieldValue("source", "");
              setSelectedMachine(null);
            }
          }}
          selectedMachine={selectedMachine}
        />
      </Col>
      <Col size={8}>
        <p>2. Select what to clone</p>
        <FormikField
          label="Clone network configuration"
          name="interfaces"
          type="checkbox"
        />
        <FormikField
          label="Clone storage configuration"
          name="storage"
          type="checkbox"
        />
      </Col>
    </Row>
  );
};

export default CloneFormFields;