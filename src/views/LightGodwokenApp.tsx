import "antd/dist/antd.css";
import AxonToCKB from "./AxonToCKB";
import Deposit from "./Deposit";
import { useEffect, useState } from "react";
import { useLightGodwoken } from "../hooks/useLightGodwoken";
import WithdrawalV1 from "./withdrawal/WithdrawalV1";
import { LightGodwokenV1 } from "../light-godwoken";
import { addNetwork } from "../utils/addNetwork";

interface Props {
  activeView?: string;
}

export default function LightGodwokenApp(props: Props) {
  const [activeView, setActiveView] = useState(props.activeView || "deposit");
  useEffect(() => {
    setActiveView(props.activeView || "deposit");
  }, [props.activeView]);
  const lightGodwoken = useLightGodwoken();
  if (lightGodwoken instanceof LightGodwokenV1) {
    addNetwork(lightGodwoken.provider.ethereum, lightGodwoken);
  }

  // const WithdrawalComp = lightGodwoken?.getVersion().toString() === "v0" ? Withdrawal : WithdrawalV1;
  const WithdrawalComp = WithdrawalV1;

  return (
    {
      withdrawal: <WithdrawalComp></WithdrawalComp>,
      deposit: <AxonToCKB></AxonToCKB>,
    }[activeView] || <AxonToCKB></AxonToCKB>
  );
}
