const db = require('../db')

function Session() {

}

Session.prototype.findAllByDoctor = async function (doctorId) {

    let query = "select distinct on (date) ss.session_id, ss.doctor_id, day, date, patient_count, \
                to_char(se.start_time, 'HH24:MI') as start_time, to_char(se.end_time, 'HH24:MI') as end_time from\
                (select s.doctor_id, s.session_id, TO_CHAR(a.date, 'YYYY-MM-DD') as date, \
                count(*) as patient_count \
                from appointment a inner join session s on a.session_id=s.session_id \
                group by s.session_id, a.date, s.doctor_id \
                having s.doctor_id=$1 and a.date >= CURRENT_DATE) as ss \
                left join session se on ss.session_id=se.session_id order by date"

    try {
        let result = await db.any(query, doctorId)
        console.log(result)
        return result
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

Session.prototype.findOneById = async function (sessionId) {
    let query = "select s.session_id, INITCAP(d.first_name || ' ' || d.last_name) as doctor_name, \
        to_char(s.start_time, 'HH24:MI') as start_time, to_char(s.end_time, 'HH24:MI') as end_time, s.day, \
        d.doctor_id, dt.doctor_type, to_char(s.time_per_patient, 'MI') as time_per_patient \
        from session s inner join doctor d on d.doctor_id=s.doctor_id \
        inner join doctor_type dt on dt.doctor_type_id=d.doctor_type_id \
        where session_id=$1"
    try {
        let result = await db.oneOrNone(query, sessionId)
        console.log(result)
        return result
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

Session.prototype.findOne = async function(sessionId){
    let query = "select to_char(start_time, 'HH24:MI') as start_time, to_char(end_time, 'HH24:MI') as end_time, day from session where session_id=$1"

    try{
        let result = await db.oneOrNone(query, sessionId)
        console.log(result)
        return result
    }
    catch(err){
        throw err
    }
}


module.exports = Session