import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom-v5-compat";

import ModelNotFound from "app/base/components/ModelNotFound";
import { useGetURLId, useWindowTitle } from "app/base/hooks";
import type { SetSearchFilter } from "app/base/types";
import LXDHostVMs from "app/kvm/components/LXDHostVMs";
import { useActivePod, useKVMDetailsRedirect } from "app/kvm/hooks";
import type { KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import podSelectors from "app/store/pod/selectors";
import { PodMeta } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";
import { isId } from "app/utils";

type Props = {
  clusterId: VMCluster["id"];
  searchFilter: string;
  setHeaderContent: KVMSetHeaderContent;
  setSearchFilter: SetSearchFilter;
};

export enum Label {
  Loading = "Loading LXD host VMs",
  Title = "LXD cluster host VMs",
}

const LXDClusterHostVMs = ({
  clusterId,
  searchFilter,
  setHeaderContent,
  setSearchFilter,
}: Props): JSX.Element => {
  const navigate = useNavigate();
  const hostId = useGetURLId(PodMeta.PK, "hostId");
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const clustersLoaded = useSelector(vmClusterSelectors.loaded);
  const hostsLoaded = useSelector(podSelectors.loaded);
  useWindowTitle(
    `${pod?.name || "Host"} in ${cluster?.name || "cluster"} virtual machines`
  );
  useActivePod(hostId);
  const redirectURL = useKVMDetailsRedirect(hostId);

  useEffect(() => {
    if (redirectURL) {
      navigate(redirectURL, { replace: true });
    }
  }, [navigate, redirectURL]);

  if (!clustersLoaded || !hostsLoaded) {
    return <Spinner aria-label={Label.Loading} />;
  }
  if (!isId(hostId) || !pod) {
    return (
      <ModelNotFound
        id={hostId}
        inSection={false}
        linkText="View all LXD hosts in this cluster"
        linkURL={kvmURLs.lxd.cluster.hosts({ clusterId })}
        modelName="LXD host"
      />
    );
  }
  return (
    <LXDHostVMs
      aria-label={Label.Title}
      clusterId={clusterId}
      hostId={hostId}
      searchFilter={searchFilter}
      setHeaderContent={setHeaderContent}
      setSearchFilter={setSearchFilter}
    />
  );
};

export default LXDClusterHostVMs;