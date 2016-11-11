**ng-smart-float-directive:**

Angular directive to get the input number in Euro format.

Args:

```
decimal-scale  --> limit the decimal scale in the input field. Will truncate the extra values. Default: 2 decimal points. If true, then same as input decimal part

dot-allowed --> allows dot character in the input. Default: true
```

**Usage:**

```
<input type="text" smartFloat decimal-scale="3" dot-allowed="false"/>```

*Example:*

| Value  	      | In view(decimal-scale not specified)   	  | decimal-scale = 3  | decimal-scale = true |
|---	          |---	                                      |----                |-----                 |
|  1000 	      |  1.000,00 	                              |  1.000,000         | 1.000                |
|  1,000 	      |  1.000,00 	                              |  1.000,000         | 1.000                |
|  1,000.00 	  |  1.000,00  	                              |  1.000,000         | 1.000,00             |
|  100,000.00 	|  100.000,00  	                            |  100.000,000       | 100.000,00           |
