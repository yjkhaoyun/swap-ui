import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { TokenInfo } from "@solana/spl-token-registry";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  Typography,
  Tabs,
  Tab,
} from "@material-ui/core";
import { TokenIcon } from "./Swap";
import { useSwappableTokens } from "../context/TokenList";
import { useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: 0,
  },
  textField: {
    marginBottom: "8px",
  },
  tab: {
    minWidth: "134px",
  },
  tabSelected: {
    color: theme.palette.primary.contrastText,
    fontWeight: 700,
    backgroundColor: theme.palette.primary.main,
    borderRadius: "10px",
  },
  tabIndicator: {
    opacity: 0,
  },
}));

export default function TokenDialog({
  open,
  onClose,
  setMint,
}: {
  open: boolean;
  onClose: () => void;
  setMint: (mint: PublicKey) => void;
}) {
  const [tabSelection, setTabSelection] = useState(0);
  const [tokenFilter, setTokenFilter] = useState("");
  //将字符串中的所有字母字符转换为小写。
  const filter = tokenFilter.toLowerCase();
  const styles = useStyles();
  const { swappableTokens, swappableTokensSollet, swappableTokensWormhole } =
    useSwappableTokens();
  const displayTabs = !useMediaQuery("(max-width:450px)");
  const selectedTokens =
    tabSelection === 0
      ? swappableTokens
      : tabSelection === 1
      ? swappableTokensWormhole
      : swappableTokensSollet;

  let tokens =
    tokenFilter === ""
      ? selectedTokens
      //filter()方法返回满足回调函数中指定条件的数组元素
      //其中tokens是TokenInfo[]类型
      /* 
                export interface TokenInfo {
                    readonly chainId: number;
                    readonly address: string;
                    readonly name: string;
                    readonly decimals: number;
                    readonly symbol: string;
                    readonly logoURI?: string;
                    readonly tags?: string[];
                    readonly extensions?: TokenExtensions;
                }
      */
      : selectedTokens.filter(
          (t) =>
            t.symbol.toLowerCase().startsWith(filter) ||
            t.name.toLowerCase().startsWith(filter) ||
            t.address.toLowerCase().startsWith(filter)
        );
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll={"paper"}
      PaperProps={{
        style: {
          borderRadius: "10px",
          width: "420px",
        },
      }}
    >
      <DialogTitle style={{ fontWeight: "bold" }}>
        <Typography variant="h6" style={{ paddingBottom: "16px" }}>
          Select a token
        </Typography>
        {/* 搜索token的组件 */}
        <TextField
          className={styles.textField}
          placeholder={"Search name"}
          value={tokenFilter}
          fullWidth
          variant="outlined"
          onChange={(e) => setTokenFilter(e.target.value)}
        />
      </DialogTitle>
      <DialogContent className={styles.dialogContent} dividers={true}>
        <List disablePadding>
          {tokens.map((tokenInfo: TokenInfo) => (
            <TokenListItem
              key={tokenInfo.address}
              tokenInfo={tokenInfo}
              onClick={(mint) => {
                setMint(mint);
                onClose();
              }}
            />
          ))}
        </List>
      </DialogContent>
      {displayTabs && (
        <DialogActions>
          <Tabs
            value={tabSelection}
            onChange={(e, v) => setTabSelection(v)}
            classes={{
              indicator: styles.tabIndicator,
            }}
          >
            <Tab
              value={0}
              className={styles.tab}
              classes={{ selected: styles.tabSelected }}
              label="Main"
            />
            <Tab
              value={1}
              className={styles.tab}
              classes={{ selected: styles.tabSelected }}
              label="Wormhole"
            />
            <Tab
              value={2}
              className={styles.tab}
              classes={{ selected: styles.tabSelected }}
              label="Sollet"
            />
          </Tabs>
        </DialogActions>
      )}
    </Dialog>
  );
}

function TokenListItem({
  tokenInfo,
  onClick,
}: {
  tokenInfo: TokenInfo;
  onClick: (mint: PublicKey) => void;
}) {
  const mint = new PublicKey(tokenInfo.address);
  return (
    <ListItem
      button
      onClick={() => onClick(mint)}
      style={{ padding: "10px 20px" }}
    >
      <TokenIcon mint={mint} style={{ width: "30px", borderRadius: "15px" }} />
      <TokenName tokenInfo={tokenInfo} />
    </ListItem>
  );
}

function TokenName({ tokenInfo }: { tokenInfo: TokenInfo }) {
  return (
    <div style={{ marginLeft: "16px" }}>
      <Typography style={{ fontWeight: "bold" }}>
        {tokenInfo?.symbol}
      </Typography>
      <Typography color="textSecondary" style={{ fontSize: "14px" }}>
        {tokenInfo?.name}
      </Typography>
    </div>
  );
}
