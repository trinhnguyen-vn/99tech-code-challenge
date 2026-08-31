
/**
 * List of the computational inefficiencies and anti-patterns found in the code block:
 
 1) FormattedWalletBalance could inherit from WalletBalance to avoid duplicating the properties and ensure type consistency.

 2) there are some missing declaring of types and hooks: BoxProps, useWalletBalances, usePrices, classes

 3) In getPriority function:
    It is a pure function, so it should be moved outside of the component 
    Param `blockchain` should be typed as string/an enum instead of any 

 4) In sortedBalances 
    
    dependencies array has unnecessary dependencies `prices`. this could make it redundant rerun the calculation when prices change
    
    the block of code `if (lhsPriority > -99) {
		     if (balance.amount <= 0 ` could be refactor to   if (lhsPriority > -99 && balance.amount <= 0){...} and the filter condition looks not correct, it shoudl return true when amount >=0.
    
    The variable `lhsPriority` is undefined in the filter function, it would throw ReferenceError. It should be `balancePriority`.  
   
    In .sort code block, it does not handle cases where priorities are equal.
    could refactor to use a more concise comparison function: return  rightPriority - leftPriority. this will automatically handle cases where priorities are equal ( do not swap), swap when rightPriority less than lefttPriority or vice versa.

 5) formattedBalances is unused, if it is intended to be used in the `rows`, formattedBalances should be wrapped in useMemo to avoid unnecessary recalculations on every render.
 6) rows should also be wrapped in useMemo.
 
 7) In `rows`, should not use index as a key, should use unique value for key such as balance.currency or a combination  of anything that uniquely identifies the row.
 Unique keys help React optimize rendering and avoid unnecessary re-renders.

 8) should check if prices[balance.currency] exists and valid number (not NaN) before using it to avoid potential undefined errors.

 9) In component's return: <div {...rest}>, should ensure that `rest` only contains valid HTML attributes to avoid React warnings (declare BoxProps to extend React.HTMLAttributes<HTMLDivElement>).

*/


// Refactored version

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
}

interface Props extends BoxProps {

}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    case 'Arbitrum':
      return 30
    case 'Zilliqa':
      return 20
    case 'Neo':
      return 20
    default:
      return -99
  }
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (balancePriority > -99 && balance.amount >= 0) {
		    return true;
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  return rightPriority - leftPriority;
    });
  }, [balances]);

  // remove formattedBalances if not used by rows
  const formattedBalances = useMemo(() => sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  }), [sortedBalances]);

  const rows = useMemo(() => formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  }), [formattedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}

