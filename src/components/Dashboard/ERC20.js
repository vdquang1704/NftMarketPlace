import { Box } from "@mui/system"
import { useWeb3React } from "@web3-react/core"
import { useSmartContact } from "hooks/useSmartContract"
import { useSelector } from "react-redux"

const {
 Grid,
 styled,
 Paper,
 Stack,
 Typography,
} = require("@mui/material");

const Aave = () => {
 const { account } = useWeb3React();

 const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#333547",
  ...theme.Typography.body2,
  textAlign: "center",
  color: "#fff",
  height: "300px",
  padding: "0px",
 }));

 const HRItem = styled(Box)(() => ({
  height: "2px",
  background:
  "linear-gradient(90deg, rgba)"
 }))
}