'use strict';

/**
* Alan Badillo Salas © 2016
* mail: badillo.soft@hotmail.com
* secure-mail: 2ax@protonmail.com
* twitter: @badillosoft
* github: badillo.soft
*/

// Libraries
var vector = require('./lib/vector.json');

// Class
class Robot {
	/**
	* This class represent a Robot able to eval commands
	* @param array commands Array of evaluables commands
	*/
	constructor (commands) {
		this.commands = {
			library: {
				vector
			}
		};

		commands = commands || [];
		for (var command of commands) {
			console.log(this.evalCommand(command));
		}
	}

	/**
	* @param command command A command that defines the new
	* command for the robot.
	* @return bool If the command has been created.
	*/
	createCommand (command) {
		var commands = this.commands;

		if (command.library) {
			commands.library[command.library] = {};
			commands = commands.library[command.library];
		}

		command.command = undefined;
		command.library = undefined;

		if (command.name === void 0) {
			return false;
		}

		var name = command.name;

		command.name = undefined;

		commands[name] = command;

		return true;
	}

	/**
	* @param string name The command name.
	* @return command The command match with this command.
	*/
	getCommand(name) {
		var lib = this.commands.library;
		for (var libname in lib) {
			for (var cmdname in lib[libname]) {
				if (cmdname === name) {
					return lib[libname][cmdname];
				}
			}
		}
		return null;
	}

	/**
	* @param commandParams input The evaluable command.
	* @return object The result with code and message.
	*/
	evalCommand (input) {
		if (!input.command) {
			return {
				code: 1,
				message: 'no command input'
			};
		}

		var command = this.getCommand(input.command);

		if (!command) {
			return {
				code: 2,
				message: 'invalid command',
				command: input.command
			};
		}

		var $ = input;

		var lines = [];

		if (typeof command.set === "string") {
			var reg = /^(\w+)\s+@(\w+)\s*(\s*\w+:.*)*/;
			command.set.replace(reg,
				(_, name, cmd, params) => {
					//console.log(name + ' ' + cmd);
					var params = params.split(' ');
					var aux_cmd = { command: cmd };
					for (var p of params) {
						var pname = p.split(':')[0];
						var value = p.split(':')[1];
						aux_cmd[pname] = eval(value);
					}
					//console.log(aux_cmd);
					var r = this.evalCommand(aux_cmd);

					$[name] = r.result;
					// console.log($);
				}
			);
		}

		if (typeof command.process === "string") {
			lines.push(command.process);
		} else if (typeof command.process === "array") {
			for (var line of command.process) {
				lines.push(line);
			}
		}

		if (typeof command.output === "string") {
			lines.push('return ' + command.output);
		} else if (typeof command.output === "array") {
			var arr = [];
			for (var cmd of command.output) {
				arr.push('eval(' + cmd + ')');
			}
			lines.push('return [' + arr.join(',') + ']');
		} else if (typeof command.output === "object") {
			var dic = [];
			for (var k in command.output) {
				dic.push(k + ': eval(' + command.output[k] + ')');
			}
			lines.push('return {' + dic.join(',') + '}');
		}

		var f = new Function('$', lines.join(';'));

		var result = null;

		try {
			result = f($);
		} catch (e) {
			return {
				code: 2,
				message: 'command error',
				command: input.command,
				error: e
			};
		}

		return {
			code: 0,
			result
		};
	}
}

// Module export
module.exports = Robot;
