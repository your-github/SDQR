export class edSecure {

  encrytionUser(data: any) {
    let rev = '';
    for (let i = data.length - 1; i >= 0; i--) {
      rev += data[i];
    }
    return rev;
  }

  encrytionNumber(data: any) {
    const n = (data * 5 / 800).toString();
    let rev = '';
    for (let i = n.length - 1; i >= 0; i--) {
      rev += n[i];
    }
    return rev;
  }

  decrytionNumber(data: any) {
    let rev = '';
    for (let i = data.length - 1; i >= 0; i--) {
      rev += data[i];
    }
    const n = (Number.parseFloat(rev) * 800 / 5 ).toString();
    return n;
  }
}
