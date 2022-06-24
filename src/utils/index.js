export * from './rtc'
export * from './im'

export const getRandomStr = (number) => {
  let s = 'abcdefghijklmnopqrstuvwxyz'
  let len = s.length
  let res = ''
  for (let i = 0; i < number; i++) {
    res += s[Math.floor(Math.random() * len)]
  }
  return res
}
