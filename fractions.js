/* jshint esversion : 6*/

//DISCLAIMER: Weird math terms found by googling!

//a long enough array of primes
//https://en.wikipedia.org/wiki/List_of_prime_numbers
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541];

//if a number is divisible by an other number
//basically if the number results in having decimals or not
const isDivisibleBy = (dividend = 1, divisor = 1) => Math.round(dividend / divisor) === dividend / divisor;

class Fraction {
	constructor (numerator = 1, denominator = 1, wholes = 0) {
		this.numerator = numerator;
		this.denominator = denominator;
		this.wholes = wholes;
	}

	//if the fraction is mixed
	isMixed() { return this.wholes !== 0; }

	//unmix the fraction by adding it to the numerator after multiplying by the denominator
	unmix() {
		this.numerator += this.wholes * this.denominator;
		this.wholes = 0;
	}

	//mix the fraction if the numerator is larger than the denominator
	mix() {
		this.wholes += Math.floor(this.numerator / this.denominator);
		this.numerator %= this.denominator;
	}

	//convert fractions into a simpler version of them
	//examples: 2/4 => 1/2, 3/9 => 1/3
	//TODO: I think this is dumb, but it works??
	simplify() {

		//init variables for later
		let i = 0, prime = primes[i];
		
		//while the prime is smaller than the numerator and denominator
		//and also if we have ran out of primes
		while (i < primes.length && prime < Math.min(this.numerator, this.denominator)) {

			//if both numerator and denominator are divisible by the prime, then divide them by said prime
			if (isDivisibleBy(this.numerator, prime) && isDivisibleBy(this.denominator, prime)) {
				this.numerator /= prime;
				this.denominator /= prime;
			}

			//pick next prime
			prime = primes[++i];

		}
	}

	//opposite of simplify()
	complicate(x) {
		this.numerator *= x;
		this.denominator *= x;
	}

	//return fraction as a decimal number
	normalize() { return this.wholes + this.numerator / this.denominator; }
}

module.exports = {

	//export the fraction class too else this entire thing is pointless
	Fraction,

	//multiply fraction by other fraction or a number
	multiplyFractions: (fraction, factor) => {

		//unmix fractions
		let f1 = fraction.unmix();
		let f2 = factor instanceof Fraction ? factor.unmix() : new Fraction(factor);

		//multiply them
		let product = new Fraction(f1.numerator * f2.numerator, f1.denominator * f2.denominator);

		//simplify and return
		return product.simplify();
	},

	//divide fraction by other fraction or a number
	divideFractions: (dividend, divisor) => {

		//unmix fractions
		let f1 = dividend.unmix();
		let f2 = divisor instanceof Fraction ? divisor.unmix() : new Fraction(divisor);

		//multiply them, but weirder this time
		let quotient = new Fraction(f1.numerator * f2.denominator, f1.denominator * f2.numerator);

		//simplify and return
		return quotient.simplify();
	},

	//add fraction by other fraction or a number
	addFractions: (fraction, summand) => {

 		//convert number into fraction
		if (summand instanceof Fraction) summand = new Fraction(summand);

		//equalize denominators
		let temp = fraction.denominator;
		fraction.complicate(summand.denominator);
		summand.complicate(temp);

		//reuse variable to remember if the fraction was mixed before unmixing it
		temp = fraction.isMixed() || summand.isMixed();
		fraction.unmix();
		summand.unmix();

		//add the fractions
		fraction.numerator += summand.numerator;
		fraction.wholes += summand.wholes;

		//if the fraction used to be mixed, make sure it does not have a larger numerator than denominator
		if (temp) fraction.mix();

		return fraction.simplify();
	},

	//subtract fraction by other fraction or a number
 	subtractFractions: (fraction, subtrahend) => {

 		//convert number into fraction
		if (subtrahend instanceof Fraction) subtrahend = new Fraction(subtrahend);

		//equalize denominators
		let temp = fraction.denominator;
		fraction.complicate(subtrahend.denominator);
		subtrahend.complicate(temp);

		//reuse variable to remember if the fraction was mixed before unmixing it
		temp = fraction.isMixed() || subtrahend.isMixed();
		fraction.unmix();
		subtrahend.unmix();

		//subtract the fractions
		fraction.numerator -= subtrahend.numerator;
		fraction.wholes -= subtrahend.wholes;

		if (temp) fraction.mix();

		return fraction;
	}
};
