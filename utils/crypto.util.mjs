import * as bcrypt from 'bcrypt'

export async function encryptPassword(password) {
	const salt = await bcrypt.genSalt(2);
	const hashedPassword = await bcrypt.hash(password, salt); // Pass the salt  << - ~ - >>	
	return hashedPassword;
}

export async function decryptPassword(password, hashedPassword) {
	bcrypt.compare(password, hashedPassword, (err, result) => {
		if (err) {
			console.log(err)
			return false;
		}
		else if (result) {
			return true;
		}
		else {
			return false;
		}
	})
}
