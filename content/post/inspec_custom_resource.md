+++
author = "Anshul Patel"
date = 2018-02-05
showthedate = true
title = "Compliance-as-Code: Developing Inspec Library"
tags = [
    "devops",
    "sitereliability",
    "security",
    "secops",
    "compliance"
]
+++


Inspec is an IT Security and Compliance-as-code framework for validating compliance.

<!--more-->

## What and Why Inspec?

* Transforms your security and compliance into the code.
* Codifies agreements.
* Provides facility to add context(descriptions, tags, impact) to your tests/code.
* Tests the desired state of infrastructure.



## Features of Inspec

* Platform agnostic.
* FOSS(Free Open Source Software)
* Ability to run tests on local or remote system irrespective of operating systems.
* Provides facility to create custom resources and share them.


## Develop Custom Resources/Library for Inspec

Let's go through sample resource which basically tests whether the given string is palindrome or not.

{{< highlight ruby >}}

class PalindromeResource < Inspec.resource(1)
  name 'palin_drome'
  desc 'This resource checks whether the attribute is palindrome or not'
  example '
    describe palin_drome() do
      it { should be_palindrome }
      its(size) { should > 5 }
    end
  '
{{< /highlight >}}


* Every custom resource should inherit from `Inspec.resource`. `1` specifies the version of class to inherit from.
* `name` specifies the name with which control file will call the resource with.
* `desc` is used to give description regarding the resource.
* `example` is used to provide an example on how to use the resource.

{{< highlight ruby >}}

  def initialize(attribute)
    @params = {}
    @attribute = attribute
    @params['size'] = attribute.length
  end

  def palindrome?
    @attribute == @attribute.reverse
  end

  def method_missing(name)
    return @params[name.to_s]
  end

{{< /highlight >}}


* `initalize` method defines the constructor for the resource class. In our method we are declaring `params` and `attribute` class variables. We are also defining the `size` hash key for the `params` which stores the length of the `attribute`.

* `palindrome` method returns the whether the boolean value which indicates whether the resource is palindrome or not. It will be used with [Inspec matchers](https://www.inspec.io/docs/reference/matchers/) to develop a control.

* `method_missing` is meta-method used by Inspec to expose the `parameters` which will be used by [Inspec DSL](https://www.inspec.io/docs/reference/dsl_inspec/). For our palindrome resource, we are only passing single parameter `size`.


### Example Control file for our Custom resource

{{< highlight ruby >}}

# encoding: utf-8
# copyright: 2018, Anshul Patel

# you add controls here
control 'Palindrome-1.0' do
  impact 1.0
  title 'Palindrome Resource'
  desc 'Palindrome Resource'
  describe palin_drome("saras")  do
    it { should be_palindrome }
    its('size') {should > 3 }
  end
end

{{< /highlight >}}

* In the above example, we develop a control which checks whether the string `saras` is palindrome or not and whether its `size` is greater than 3 or not.

__Example GitHub Repository__ : https://github.com/anshulpatel25/palindrome-inspec

## References

* https://www.inspec.io/docs/
