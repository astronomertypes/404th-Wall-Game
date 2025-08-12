class Solution:
    def printNumbers( n):
        # Your code goes here
        printNumbers(n-1)
        if n==0:
          return
        print(n)
        