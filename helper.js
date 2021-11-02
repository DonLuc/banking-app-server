function checkIfAccountExist(accountNumber, accounts) {
    var accountsKeysArray = Object.keys(accounts.accounts) ;
    var  accountKey = accountsKeysArray.filter((key) => key === accountNumber)
    if (accountKey == "" ||
        accountKey == null ||
        accountKey == undefined
    ) {
        return false;
    } else {
        return true;
    }
}